import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { roleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/role.enum';

describe('roleGuard', () => {
    let authService: jasmine.SpyObj<AuthService>;
    let router: jasmine.SpyObj<Router>;
    let mockRoute: ActivatedRouteSnapshot;
    let mockState: RouterStateSnapshot;

    beforeEach(() => {
        const authServiceSpy = jasmine.createSpyObj('AuthService', [
            'isAuthenticated',
            'hasAnyRole',
        ]);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            providers: [
                { provide: AuthService, useValue: authServiceSpy },
                { provide: Router, useValue: routerSpy },
            ],
        });

        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

        mockRoute = {
            data: {},
        } as ActivatedRouteSnapshot;
        mockState = { url: '/gestionnaire/dashboard' } as RouterStateSnapshot;
    });

    it('should redirect to login if user is not authenticated', () => {
        authService.isAuthenticated.and.returnValue(false);
        mockRoute.data = { roles: [Role.GESTIONNAIRE] };

        const result = TestBed.runInInjectionContext(() => roleGuard(mockRoute, mockState));

        expect(result).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['/auth/login'], {
            queryParams: { returnUrl: '/gestionnaire/dashboard' },
        });
    });

    it('should allow access when user has required role', () => {
        authService.isAuthenticated.and.returnValue(true);
        authService.hasAnyRole.and.returnValue(true);
        mockRoute.data = { roles: [Role.GESTIONNAIRE] };

        const result = TestBed.runInInjectionContext(() => roleGuard(mockRoute, mockState));

        expect(result).toBe(true);
        expect(authService.hasAnyRole).toHaveBeenCalledWith([Role.GESTIONNAIRE]);
        expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should deny access when user does not have required role', () => {
        authService.isAuthenticated.and.returnValue(true);
        authService.hasAnyRole.and.returnValue(false);
        mockRoute.data = { roles: [Role.GESTIONNAIRE] };

        const result = TestBed.runInInjectionContext(() => roleGuard(mockRoute, mockState));

        expect(result).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['/access-denied']);
    });

    it('should allow access when no roles are specified', () => {
        authService.isAuthenticated.and.returnValue(true);
        mockRoute.data = { roles: [] };

        const result = TestBed.runInInjectionContext(() => roleGuard(mockRoute, mockState));

        expect(result).toBe(true);
        expect(authService.hasAnyRole).not.toHaveBeenCalled();
    });

    it('should allow access when roles data is not present', () => {
        authService.isAuthenticated.and.returnValue(true);
        mockRoute.data = {};

        const result = TestBed.runInInjectionContext(() => roleGuard(mockRoute, mockState));

        expect(result).toBe(true);
    });

    it('should allow access when user has at least one of multiple required roles', () => {
        authService.isAuthenticated.and.returnValue(true);
        authService.hasAnyRole.and.returnValue(true);
        mockRoute.data = { roles: [Role.GESTIONNAIRE, Role.CLIENT] };

        const result = TestBed.runInInjectionContext(() => roleGuard(mockRoute, mockState));

        expect(result).toBe(true);
        expect(authService.hasAnyRole).toHaveBeenCalledWith([Role.GESTIONNAIRE, Role.CLIENT]);
    });

    it('should deny access when user has none of the required roles', () => {
        authService.isAuthenticated.and.returnValue(true);
        authService.hasAnyRole.and.returnValue(false);
        mockRoute.data = { roles: [Role.GESTIONNAIRE, Role.LIVREUR] };

        const result = TestBed.runInInjectionContext(() => roleGuard(mockRoute, mockState));

        expect(result).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['/access-denied']);
    });
});
