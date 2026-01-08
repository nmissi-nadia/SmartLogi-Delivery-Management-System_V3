import { Routes } from '@angular/router';

/**
 * Routes pour le module Gestionnaire
 * Toutes ces routes nécessitent le rôle GESTIONNAIRE
 */
export const GESTIONNAIRE_ROUTES: Routes = [
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'colis',
        loadComponent: () => import('./colis-list/colis-list.component').then(m => m.ColisListComponent)
    },
    {
        path: 'clients',
        loadComponent: () => import('./clients-management/clients-management.component').then(m => m.ClientsManagementComponent)
    },
    {
        path: 'livreurs',
        loadComponent: () => import('./livreurs-management/livreurs-management.component').then(m => m.LivreursManagementComponent)
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    }
];
