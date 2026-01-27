import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClientsState } from './clients.state';

/**
 * Selectors pour accéder à l'état des clients
 */

export const selectClientsState = createFeatureSelector<ClientsState>('clients');

export const selectAllClients = createSelector(
    selectClientsState,
    (state) => state.clients
);

export const selectSelectedClient = createSelector(
    selectClientsState,
    (state) => state.selectedClient
);

export const selectClientsLoading = createSelector(
    selectClientsState,
    (state) => state.loading
);

export const selectClientsError = createSelector(
    selectClientsState,
    (state) => state.error
);

export const selectClientById = (id: string) => createSelector(
    selectAllClients,
    (clients) => clients.find(c => c.id === id)
);

export const selectClientsCount = createSelector(
    selectAllClients,
    (clients) => clients.length
);
