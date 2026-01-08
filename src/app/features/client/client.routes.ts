import { Routes } from '@angular/router';

/**
 * Routes pour le module Client
 * Toutes ces routes nécessitent le rôle CLIENT
 */
export const CLIENT_ROUTES: Routes = [
    {
        path: 'nouvelle-livraison',
        loadComponent: () => import('./nouvelle-livraison/nouvelle-livraison.component').then(m => m.NouvelleLivraisonComponent)
    },
    {
        path: 'mes-colis',
        loadComponent: () => import('./mes-colis/mes-colis.component').then(m => m.MesColisComponent)
    },
    {
        path: 'historique',
        loadComponent: () => import('./historique/historique.component').then(m => m.HistoriqueComponent)
    },
    {
        path: '',
        redirectTo: 'mes-colis',
        pathMatch: 'full'
    }
];
