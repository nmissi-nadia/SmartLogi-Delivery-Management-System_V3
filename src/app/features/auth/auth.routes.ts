import { Routes } from '@angular/router';

/**
 * Routes pour le module d'authentification
 */
export const AUTH_ROUTES: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'oauth2/redirect',
        loadComponent: () => import('./oauth2-callback/oauth2-callback.component').then(m => m.OAuth2CallbackComponent)
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
