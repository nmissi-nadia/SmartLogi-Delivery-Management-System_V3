import { ClientExpediteur } from '../../core/models/client.model';

/**
 * État de la gestion des clients
 */
export interface ClientsState {
    clients: ClientExpediteur[];
    selectedClient: ClientExpediteur | null;
    loading: boolean;
    error: string | null;
}

/**
 * État initial des clients
 */
export const initialClientsState: ClientsState = {
    clients: [],
    selectedClient: null,
    loading: false,
    error: null
};
