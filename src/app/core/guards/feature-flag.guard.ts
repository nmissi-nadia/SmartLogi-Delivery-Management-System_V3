import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of } from 'rxjs';

/**
 * Guard pour gérer l'activation de fonctionnalités selon des flags
 * (Simulation pour l'instant)
 */
export const featureFlagGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const flag = route.data['featureFlag'] as string;

    // Simulation de vérification de feature flag
    const enabledFeatures = ['DASHBOARD_V2', 'REAL_TIME_TRACKING'];

    if (!flag || enabledFeatures.includes(flag)) {
        return true;
    }

    console.warn(`Feature flag ${flag} is disabled.`);
    router.navigate(['/']);
    return false;
};
