import { CanDeactivateFn } from '@angular/router';

export interface CanComponentDeactivate {
    canDeactivate: () => boolean | import('rxjs').Observable<boolean> | Promise<boolean>;
}

/**
 * Guard pour prévenir la navigation si des modifications non enregistrées existent
 */
export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
    if (component.canDeactivate && !component.canDeactivate()) {
        return confirm('Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter cette page ?');
    }
    return true;
};
