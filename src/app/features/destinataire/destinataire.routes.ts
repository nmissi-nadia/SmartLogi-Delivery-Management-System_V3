import { Routes } from '@angular/router';

/**
 * Routes pour le module Destinataire
 * Toutes ces routes nécessitent le rôle DESTINATAIRE
 */
export const DESTINATAIRE_ROUTES: Routes = [
    {
        path: 'suivi-colis',
        loadComponent: () => import('./suivi-colis/suivi-colis.component').then(m => m.SuiviColisComponent)
    },
    {
        path: '',
        redirectTo: 'suivi-colis',
        pathMatch: 'full'
    }
];
