import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/role.enum';

/**
 * Guard pour protéger les routes selon les rôles utilisateur
 * Vérifie si l'utilisateur a les rôles nécessaires pour accéder à la route
 * 
 * Utilisation dans les routes :
 * { 
 *   path: 'gestionnaire', 
 *   component: GestionnaireComponent, 
 *   canActivate: [authGuard, roleGuard],
 *   data: { roles: [Role.GESTIONNAIRE] }
 * }
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Vérifier d'abord si l'utilisateur est authentifié
    if (!authService.isAuthenticated()) {
        router.navigate(['/auth/login'], {
            queryParams: { returnUrl: state.url }
        });
        return false;
    }

    // Récupérer les rôles requis depuis les données de la route
    const requiredRoles = route.data['roles'] as Role[];

    // Si aucun rôle n'est spécifié, autoriser l'accès
    if (!requiredRoles || requiredRoles.length === 0) {
        return true;
    }

    // Vérifier si l'utilisateur a au moins un des rôles requis
    if (authService.hasAnyRole(requiredRoles)) {
        return true;
    }

    // L'utilisateur n'a pas les permissions nécessaires
    console.warn('Accès refusé : rôles insuffisants');

    // Rediriger vers une page d'accès refusé ou la page d'accueil
    router.navigate(['/access-denied']);

    return false;
};
