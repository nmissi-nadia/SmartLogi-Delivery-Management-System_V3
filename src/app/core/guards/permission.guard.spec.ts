import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, firstValueFrom } from 'rxjs';
import { permissionGuard } from './permission.guard';
import { AppState } from '../../store';
import { User, Role } from '../models';

describe('permissionGuard', () => {
    let store: jasmine.SpyObj<Store<AppState>>;
    let router: jasmine.SpyObj<Router>;
    let mockRoute: ActivatedRouteSnapshot;
    let mockState: RouterStateSnapshot;

    beforeEach(() => {
        const storeSpy = jasmine.createSpyObj('Store', ['select']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            providers: [
                { provide: Store, useValue: storeSpy },
                { provide: Router, useValue: routerSpy }
            ]
        });

        store = TestBed.inject(Store) as jasmine.SpyObj<Store<AppState>>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

        mockRoute = {
            data: { permissions: ['MANAGE_USERS'] }
        } as any;

        mockState = { url: '/admin/users' } as RouterStateSnapshot;
    });

    it('should allow access when user is authenticated', async () => {
        // Arrange
        const mockUser: User = {
            id: 1,
            username: 'admin',
            email: 'admin@test.com',
            roles: [Role.GESTIONNAIRE]
        };
        store.select.and.returnValue(of(mockUser));

        // Act & Assert
        await TestBed.runInInjectionContext(async () => {
            const result = permissionGuard(mockRoute, mockState);
            const canActivate = await firstValueFrom(result as any);
            expect(canActivate).toBeTrue();
            expect(router.navigate).not.toHaveBeenCalled();
        });
    });

    it('should deny access and redirect to login when user is not authenticated', async () => {
        // Arrange
        store.select.and.returnValue(of(null));

        // Act & Assert
        await TestBed.runInInjectionContext(async () => {
            const result = permissionGuard(mockRoute, mockState);
            const canActivate = await firstValueFrom(result as any);
            expect(canActivate).toBeFalse();
            expect(router.navigate).toHaveBeenCalledWith(
                ['/auth/login'],
                { queryParams: { returnUrl: mockState.url } }
            );
        });
    });
});
