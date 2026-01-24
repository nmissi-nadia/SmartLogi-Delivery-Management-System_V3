import { createReducer, on } from '@ngrx/store';
import { LivreursState, initialLivreursState } from './livreurs.state';
import * as LivreursActions from './livreurs.actions';

/**
 * Reducer pour la gestion des livreurs
 */
export const livreursReducer = createReducer(
    initialLivreursState,

    // ========== Load Livreurs ==========
    on(LivreursActions.loadLivreurs, (state): LivreursState => ({
        ...state,
        loading: true,
        error: null
    })),

    on(LivreursActions.loadLivreursSuccess, (state, { livreurs }): LivreursState => ({
        ...state,
        livreurs,
        loading: false,
        error: null
    })),

    on(LivreursActions.loadLivreursFailure, (state, { error }): LivreursState => ({
        ...state,
        loading: false,
        error
    })),

    // ========== Load Livreur By Id ==========
    on(LivreursActions.loadLivreurById, (state): LivreursState => ({
        ...state,
        loading: true,
        error: null
    })),

    on(LivreursActions.loadLivreurByIdSuccess, (state, { livreur }): LivreursState => ({
        ...state,
        selectedLivreur: livreur,
        loading: false,
        error: null
    })),

    on(LivreursActions.loadLivreurByIdFailure, (state, { error }): LivreursState => ({
        ...state,
        loading: false,
        error
    })),

    // ========== Create Livreur ==========
    on(LivreursActions.createLivreur, (state): LivreursState => ({
        ...state,
        loading: true,
        error: null
    })),

    on(LivreursActions.createLivreurSuccess, (state, { livreur }): LivreursState => ({
        ...state,
        livreurs: [...state.livreurs, livreur],
        loading: false,
        error: null
    })),

    on(LivreursActions.createLivreurFailure, (state, { error }): LivreursState => ({
        ...state,
        loading: false,
        error
    })),

    // ========== Update Livreur ==========
    on(LivreursActions.updateLivreur, (state): LivreursState => ({
        ...state,
        loading: true,
        error: null
    })),

    on(LivreursActions.updateLivreurSuccess, (state, { livreur }): LivreursState => ({
        ...state,
        livreurs: state.livreurs.map(l => l.id === livreur.id ? livreur : l),
        selectedLivreur: state.selectedLivreur?.id === livreur.id ? livreur : state.selectedLivreur,
        loading: false,
        error: null
    })),

    on(LivreursActions.updateLivreurFailure, (state, { error }): LivreursState => ({
        ...state,
        loading: false,
        error
    })),

    // ========== Delete Livreur ==========
    on(LivreursActions.deleteLivreur, (state): LivreursState => ({
        ...state,
        loading: true,
        error: null
    })),

    on(LivreursActions.deleteLivreurSuccess, (state, { id }): LivreursState => ({
        ...state,
        livreurs: state.livreurs.filter(l => l.id !== id),
        selectedLivreur: state.selectedLivreur?.id === id ? null : state.selectedLivreur,
        loading: false,
        error: null
    })),

    on(LivreursActions.deleteLivreurFailure, (state, { error }): LivreursState => ({
        ...state,
        loading: false,
        error
    })),

    // ========== Select Livreur ==========
    on(LivreursActions.selectLivreur, (state, { id }): LivreursState => ({
        ...state,
        selectedLivreur: state.livreurs.find(l => l.id === id) || null
    })),

    on(LivreursActions.clearSelectedLivreur, (state): LivreursState => ({
        ...state,
        selectedLivreur: null
    }))
);
