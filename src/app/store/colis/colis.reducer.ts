import { createReducer, on } from '@ngrx/store';
import { ColisState, initialColisState } from './colis.state';
import * as ColisActions from './colis.actions';

/**
 * Reducer pour gérer l'état des colis
 */
export const colisReducer = createReducer(
    initialColisState,

    // Load Colis
    on(ColisActions.loadColis, (state): ColisState => ({
        ...state,
        loading: true,
        error: null
    })),

    on(ColisActions.loadColisSuccess, (state, { colis }): ColisState => ({
        ...state,
        colis,
        loading: false,
        error: null
    })),

    on(ColisActions.loadColisFailure, (state, { error }): ColisState => ({
        ...state,
        loading: false,
        error
    })),

    // Load Colis By Client
    on(ColisActions.loadColisByClient, (state): ColisState => ({
        ...state,
        loading: true,
        error: null
    })),

    on(ColisActions.loadColisByClientSuccess, (state, { colis }): ColisState => ({
        ...state,
        colis,
        loading: false,
        error: null
    })),

    // Select Colis
    on(ColisActions.selectColis, (state, { colisId }): ColisState => ({
        ...state,
        selectedColis: state.colis.find(c => c.id === colisId) || null
    })),

    on(ColisActions.clearSelectedColis, (state): ColisState => ({
        ...state,
        selectedColis: null
    })),

    // Update Statut
    on(ColisActions.updateColisStatut, (state): ColisState => ({
        ...state,
        loading: true,
        error: null
    })),

    on(ColisActions.updateColisStatutSuccess, (state, { colis }): ColisState => ({
        ...state,
        colis: state.colis.map(c => c.id === colis.id ? colis : c),
        selectedColis: state.selectedColis?.id === colis.id ? colis : state.selectedColis,
        loading: false,
        error: null
    })),

    on(ColisActions.updateColisStatutFailure, (state, { error }): ColisState => ({
        ...state,
        loading: false,
        error
    })),

    // Filters
    on(ColisActions.setStatutFilter, (state, { statut }): ColisState => ({
        ...state,
        filters: {
            ...state.filters,
            statut
        }
    })),

    on(ColisActions.setRechercheFilter, (state, { recherche }): ColisState => ({
        ...state,
        filters: {
            ...state.filters,
            recherche
        }
    })),

    on(ColisActions.clearFilters, (state): ColisState => ({
        ...state,
        filters: initialColisState.filters
    }))
);
