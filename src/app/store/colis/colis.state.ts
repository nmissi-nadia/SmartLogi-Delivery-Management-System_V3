import { Colis } from '../../core/services/colis.service';

/**
 * État de la gestion des colis dans le store NgRx
 */
export interface ColisState {
    colis: Colis[];
    selectedColis: Colis | null;
    loading: boolean;
    error: string | null;
    filters: {
        statut: string;
        recherche: string;
    };
}

/**
 * État initial
 */
export const initialColisState: ColisState = {
    colis: [],
    selectedColis: null,
    loading: false,
    error: null,
    filters: {
        statut: 'tous',
        recherche: ''
    }
};

/**
 * Interface de l'état global de l'application
 */
export interface AppState {
    colis: ColisState;
}
