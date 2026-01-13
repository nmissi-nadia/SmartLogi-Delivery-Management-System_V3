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

    const isAuth = authService.isAuthenticated();
    console.log('AuthGuard - Route:', state.url);
    console.log('AuthGuard - isAuthenticated:', isAuth);

    if (isAuth) {
        console.log('AuthGuard - Access granted');
        return true;
    }

    console.log('AuthGuard - Access denied, redirecting to login');
    router.navigate(['/auth/login'], {
        queryParams: { returnUrl: state.url }
    });

    return false;
};
