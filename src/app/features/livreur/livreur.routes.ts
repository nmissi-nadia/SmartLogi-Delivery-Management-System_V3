import { Routes } from '@angular/router';

/**
 * Routes pour le module Livreur
 * Toutes ces routes nécessitent le rôle LIVREUR
 */
export const LIVREUR_ROUTES: Routes = [
    {
        path: 'mes-colis',
        loadComponent: () => import('./mes-colis/mes-colis.component').then(m => m.MesColisComponent)
    },
    {
        path: 'tournee',
        loadComponent: () => import('./tournee/tournee.component').then(m => m.TourneeComponent)
    },
    {
        path: '',
        redirectTo: 'mes-colis',
        pathMatch: 'full'
    }
];
