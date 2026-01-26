import { TestBed } from '@angular/core/testing';
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of, firstValueFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { userProfileResolver } from './user-profile.resolver';
import { AppState } from '../../store';
import { User, Role } from '../models';

describe('userProfileResolver', () => {
    let store: jasmine.SpyObj<Store<AppState>>;
    let mockRoute: ActivatedRouteSnapshot;
    let mockState: RouterStateSnapshot;

    beforeEach(() => {
        const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']);

        TestBed.configureTestingModule({
            providers: [
                { provide: Store, useValue: storeSpy }
            ]
        });

        store = TestBed.inject(Store) as jasmine.SpyObj<Store<AppState>>;
        mockRoute = {} as ActivatedRouteSnapshot;
        mockState = {} as RouterStateSnapshot;
    });

    it('should resolve user profile', async () => {
        // Arrange
        const mockUser: User = {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            nom: 'Test',
            prenom: 'User',
            roles: [Role.CLIENT]
        };
        store.select.and.returnValue(of(mockUser));

        // Act & Assert
        await TestBed.runInInjectionContext(async () => {
            const result = userProfileResolver(mockRoute, mockState);
            const user = await firstValueFrom(result as any);
            expect(user).toEqual(mockUser);
            expect(store.dispatch).toHaveBeenCalled();
        });
    });
});
