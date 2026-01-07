import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard pour protéger les routes nécessitant une authentification
 * Vérifie si l'utilisateur est connecté avant d'autoriser l'accès à la route
 * 
 * Utilisation dans les routes :
 * { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }
 */
export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    }

    // Rediriger vers la page de login en conservant l'URL demandée
    router.navigate(['/auth/login'], {
        queryParams: { returnUrl: state.url }
    });

    return false;
};
