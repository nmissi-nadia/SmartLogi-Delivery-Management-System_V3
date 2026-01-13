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
        path: 'colis-list',
        loadComponent: () => import('./colis-list/colis-list.component').then(m => m.ColisListComponent)
    },
    {
        path: 'colis/:id',
        loadComponent: () => import('../client/colis-details/colis-details.component').then(m => m.ColisDetailsComponent)
    },
    {
        path: 'clients-management',
        loadComponent: () => import('./clients-management/clients-management.component').then(m => m.ClientsManagementComponent)
    },
    {
        path: 'livreurs-management',
        loadComponent: () => import('./livreurs-management/livreurs-management.component').then(m => m.LivreursManagementComponent)
    },
    {
        path: 'zones',
        loadComponent: () => import('./zones-management/zones-management.component').then(m => m.ZonesManagementComponent)
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    }
];
