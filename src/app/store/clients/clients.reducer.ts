import { createReducer, on } from '@ngrx/store';
import { ClientsState, initialClientsState } from './clients.state';
import * as ClientsActions from './clients.actions';

/**
 * Reducer pour la gestion des clients
 */
export const clientsReducer = createReducer(
    initialClientsState,

    // ========== Load Clients ==========
    on(ClientsActions.loadClients, (state): ClientsState => ({
        ...state,
        loading: true,
        error: null
    })),

    on(ClientsActions.loadClientsSuccess, (state, { clients }): ClientsState => ({
        ...state,
        clients,
        loading: false,
        error: null
    })),

    on(ClientsActions.loadClientsFailure, (state, { error }): ClientsState => ({
        ...state,
        loading: false,
        error
    })),

    // ========== Load Client By Id ==========
    on(ClientsActions.loadClientById, (state): ClientsState => ({
        ...state,
        loading: true,
        error: null
    })),

    on(ClientsActions.loadClientByIdSuccess, (state, { client }): ClientsState => ({
        ...state,
        selectedClient: client,
        loading: false,
        error: null
    })),

    on(ClientsActions.loadClientByIdFailure, (state, { error }): ClientsState => ({
        ...state,
        loading: false,
        error
    })),

    // ========== Search Clients ==========
    on(ClientsActions.searchClients, (state): ClientsState => ({
        ...state,
        loading: true,
        error: null
    })),

    on(ClientsActions.searchClientsSuccess, (state, { clients }): ClientsState => ({
        ...state,
        clients,
        loading: false,
        error: null
    })),

    on(ClientsActions.searchClientsFailure, (state, { error }): ClientsState => ({
        ...state,
        loading: false,
        error
    })),

    // ========== Create Client ==========
    on(ClientsActions.createClient, (state): ClientsState => ({
        ...state,
        loading: true,
        error: null
    })),

    on(ClientsActions.createClientSuccess, (state, { client }): ClientsState => ({
        ...state,
        clients: [...state.clients, client],
        loading: false,
        error: null
    })),

    on(ClientsActions.createClientFailure, (state, { error }): ClientsState => ({
        ...state,
        loading: false,
        error
    })),

    // ========== Update Client ==========
    on(ClientsActions.updateClient, (state): ClientsState => ({
        ...state,
        loading: true,
        error: null
    })),

    on(ClientsActions.updateClientSuccess, (state, { client }): ClientsState => ({
        ...state,
        clients: state.clients.map(c => c.id === client.id ? client : c),
        selectedClient: state.selectedClient?.id === client.id ? client : state.selectedClient,
        loading: false,
        error: null
    })),

    on(ClientsActions.updateClientFailure, (state, { error }): ClientsState => ({
        ...state,
        loading: false,
        error
    })),

    // ========== Delete Client ==========
    on(ClientsActions.deleteClient, (state): ClientsState => ({
        ...state,
        loading: true,
        error: null
    })),

    on(ClientsActions.deleteClientSuccess, (state, { id }): ClientsState => ({
        ...state,
        clients: state.clients.filter(c => c.id !== id),
        selectedClient: state.selectedClient?.id === id ? null : state.selectedClient,
        loading: false,
        error: null
    })),

    on(ClientsActions.deleteClientFailure, (state, { error }): ClientsState => ({
        ...state,
        loading: false,
        error
    })),

    // ========== Select Client ==========
    on(ClientsActions.selectClient, (state, { id }): ClientsState => ({
        ...state,
        selectedClient: state.clients.find(c => c.id === id) || null
    })),

    on(ClientsActions.clearSelectedClient, (state): ClientsState => ({
        ...state,
        selectedClient: null
    }))
);
