import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { featureFlagGuard } from './feature-flag.guard';

describe('featureFlagGuard', () => {
    let router: jasmine.SpyObj<Router>;
    let mockRoute: ActivatedRouteSnapshot;
    let mockState: RouterStateSnapshot;

    beforeEach(() => {
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            providers: [
                { provide: Router, useValue: routerSpy }
            ]
        });

        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        mockRoute = { data: {} } as any;
        mockState = { url: '/feature' } as RouterStateSnapshot;
    });

    it('should allow access when feature flag is enabled', () => {
        // Arrange
        mockRoute.data = { featureFlag: 'DASHBOARD_V2' };

        // Act
        const result = TestBed.runInInjectionContext(() => {
            return featureFlagGuard(mockRoute, mockState);
        });

        // Assert
        expect(result).toBeTrue();
        expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should allow access when no feature flag is specified', () => {
        // Arrange
        mockRoute.data = {};

        // Act
        const result = TestBed.runInInjectionContext(() => {
            return featureFlagGuard(mockRoute, mockState);
        });

        // Assert
        expect(result).toBeTrue();
        expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should deny access and redirect when feature flag is disabled', () => {
        // Arrange
        mockRoute.data = { featureFlag: 'DISABLED_FEATURE' };

        // Act
        const result = TestBed.runInInjectionContext(() => {
            return featureFlagGuard(mockRoute, mockState);
        });

        // Assert
        expect(result).toBeFalse();
        expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
});
