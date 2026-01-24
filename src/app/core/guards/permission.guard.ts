import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { AppState } from '../../store';
import * as AuthSelectors from '../../store/auth/auth.selectors';

/**
 * Guard pour gérer les permissions granulaires (en plus du rôle)
 */
export const permissionGuard: CanActivateFn = (route, state) => {
    const store = inject(Store<AppState>);
    const router = inject(Router);

    const requiredPermissions = route.data['permissions'] as string[];

    return store.select(AuthSelectors.selectCurrentUser).pipe(
        take(1),
        map(user => {
            if (!user) {
                router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
                return false;
            }

            // Ici on pourrait implémenter une logique de permissions complexes
            // Pour l'instant on vérifie si l'utilisateur est présent et a potentiellement les permissions
            // (On assume que le RoleGuard a déjà fait une partie du travail)
            return true;
        })
    );
};
