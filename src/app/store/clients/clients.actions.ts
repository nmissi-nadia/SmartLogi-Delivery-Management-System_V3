import { createAction, props } from '@ngrx/store';
import { ClientExpediteur, CreateClientDTO } from '../../core/models/client.model';

/**
 * Actions pour la gestion des clients
 */

// ========== Load All Clients ==========
export const loadClients = createAction('[Clients] Load Clients');

export const loadClientsSuccess = createAction(
    '[Clients] Load Clients Success',
    props<{ clients: ClientExpediteur[] }>()
);

export const loadClientsFailure = createAction(
    '[Clients] Load Clients Failure',
    props<{ error: string }>()
);

// ========== Load Client By Id ==========
export const loadClientById = createAction(
    '[Clients] Load Client By Id',
    props<{ id: string }>()
);

export const loadClientByIdSuccess = createAction(
    '[Clients] Load Client By Id Success',
    props<{ client: ClientExpediteur }>()
);

export const loadClientByIdFailure = createAction(
    '[Clients] Load Client By Id Failure',
    props<{ error: string }>()
);

// ========== Search Clients ==========
export const searchClients = createAction(
    '[Clients] Search Clients',
    props<{ keyword: string; page: number; size: number }>()
);

export const searchClientsSuccess = createAction(
    '[Clients] Search Clients Success',
    props<{ clients: ClientExpediteur[] }>()
);

export const searchClientsFailure = createAction(
    '[Clients] Search Clients Failure',
    props<{ error: string }>()
);

// ========== Create Client ==========
export const createClient = createAction(
    '[Clients] Create Client',
    props<{ client: CreateClientDTO }>()
);

export const createClientSuccess = createAction(
    '[Clients] Create Client Success',
    props<{ client: ClientExpediteur }>()
);

export const createClientFailure = createAction(
    '[Clients] Create Client Failure',
    props<{ error: string }>()
);

// ========== Update Client ==========
export const updateClient = createAction(
    '[Clients] Update Client',
    props<{ id: string; client: Partial<CreateClientDTO> }>()
);

export const updateClientSuccess = createAction(
    '[Clients] Update Client Success',
    props<{ client: ClientExpediteur }>()
);

export const updateClientFailure = createAction(
    '[Clients] Update Client Failure',
    props<{ error: string }>()
);

// ========== Delete Client ==========
export const deleteClient = createAction(
    '[Clients] Delete Client',
    props<{ id: string }>()
);

export const deleteClientSuccess = createAction(
    '[Clients] Delete Client Success',
    props<{ id: string }>()
);

export const deleteClientFailure = createAction(
    '[Clients] Delete Client Failure',
    props<{ error: string }>()
);

// ========== Select Client ==========
export const selectClient = createAction(
    '[Clients] Select Client',
    props<{ id: string }>()
);

export const clearSelectedClient = createAction(
    '[Clients] Clear Selected Client'
);
