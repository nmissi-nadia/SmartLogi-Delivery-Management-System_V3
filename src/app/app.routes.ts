import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { Role } from './core/models/role.enum';

export const routes: Routes = [
    // Routes publiques (authentification)
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },

    // Routes protégées - Gestionnaire
    {
        path: 'gestionnaire',
        loadChildren: () => import('./features/gestionnaire/gestionnaire.routes').then(m => m.GESTIONNAIRE_ROUTES),
        canActivate: [authGuard, roleGuard],
        data: { roles: [Role.GESTIONNAIRE] }
    },

    // Routes protégées - Livreur
    {
        path: 'livreur',
        loadChildren: () => import('./features/livreur/livreur.routes').then(m => m.LIVREUR_ROUTES),
        canActivate: [authGuard, roleGuard],
        data: { roles: [Role.LIVREUR] }
    },

    // Routes protégées - Client
    {
        path: 'client',
        loadChildren: () => import('./features/client/client.routes').then(m => m.CLIENT_ROUTES),
        canActivate: [authGuard, roleGuard],
        data: { roles: [Role.CLIENT] }
    },

    // Routes protégées - Destinataire
    {
        path: 'destinataire',
        loadChildren: () => import('./features/destinataire/destinataire.routes').then(m => m.DESTINATAIRE_ROUTES),
        canActivate: [authGuard, roleGuard],
        data: { roles: [Role.DESTINATAIRE] }
    },

    // Page d'accès refusé
    {
        path: 'access-denied',
        loadComponent: () => import('./shared/components/access-denied/access-denied.component').then(m => m.AccessDeniedComponent)
    },

    // Redirection par défaut
    {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full'
    },

    // Route 404 - Page non trouvée
    {
        path: '**',
        redirectTo: '/auth/login'
    }
];
