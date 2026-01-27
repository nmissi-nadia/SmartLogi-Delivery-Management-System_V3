import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
    let authService: jasmine.SpyObj<AuthService>;
    let router: jasmine.SpyObj<Router>;
    let mockRoute: ActivatedRouteSnapshot;
    let mockState: RouterStateSnapshot;

    beforeEach(() => {
        const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            providers: [
                { provide: AuthService, useValue: authServiceSpy },
                { provide: Router, useValue: routerSpy },
            ],
        });

        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

        mockRoute = {} as ActivatedRouteSnapshot;
        mockState = { url: '/gestionnaire/dashboard' } as RouterStateSnapshot;
    });

    it('should allow access when user is authenticated', () => {
        authService.isAuthenticated.and.returnValue(true);

        const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

        expect(result).toBe(true);
        expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should deny access and redirect to login when user is not authenticated', () => {
        authService.isAuthenticated.and.returnValue(false);

        const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

        expect(result).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['/auth/login'], {
            queryParams: { returnUrl: '/gestionnaire/dashboard' },
        });
    });

    it('should preserve the return URL in query params', () => {
        authService.isAuthenticated.and.returnValue(false);
        mockState = { url: '/client/mes-colis' } as RouterStateSnapshot;

        TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

        expect(router.navigate).toHaveBeenCalledWith(['/auth/login'], {
            queryParams: { returnUrl: '/client/mes-colis' },
        });
    });

    it('should not redirect when already on login page', () => {
        authService.isAuthenticated.and.returnValue(false);
        mockState = { url: '/auth/login' } as RouterStateSnapshot;

        const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

        expect(result).toBe(false);
        expect(router.navigate).toHaveBeenCalled();
    });
});
