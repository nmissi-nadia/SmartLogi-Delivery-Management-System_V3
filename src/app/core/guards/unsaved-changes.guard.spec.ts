import { TestBed } from '@angular/core/testing';
import { unsavedChangesGuard, CanComponentDeactivate } from './unsaved-changes.guard';

/**
 * Tests unitaires pour unsavedChangesGuard
 */
describe('unsavedChangesGuard', () => {
    let mockComponent: jasmine.SpyObj<CanComponentDeactivate>;

    beforeEach(() => {
        mockComponent = jasmine.createSpyObj('CanComponentDeactivate', ['canDeactivate']);

        TestBed.configureTestingModule({});
    });

    it('should allow navigation if canDeactivate returns true', () => {
        mockComponent.canDeactivate.and.returnValue(true);

        const result = TestBed.runInInjectionContext(() =>
            unsavedChangesGuard(mockComponent, {} as any, {} as any, {} as any)
        );

        expect(result).toBeTrue();
    });

    it('should show confirm dialog and return its value if canDeactivate returns false', () => {
        mockComponent.canDeactivate.and.returnValue(false);
        spyOn(window, 'confirm').and.returnValue(true);

        const result = TestBed.runInInjectionContext(() =>
            unsavedChangesGuard(mockComponent, {} as any, {} as any, {} as any)
        );

        expect(window.confirm).toHaveBeenCalled();
        expect(result).toBeTrue();
    });

    it('should allow navigation if canDeactivate is not implemented', () => {
        const simpleComponent = {} as CanComponentDeactivate;

        const result = TestBed.runInInjectionContext(() =>
            unsavedChangesGuard(simpleComponent, {} as any, {} as any, {} as any)
        );

        expect(result).toBeTrue();
    });
});
