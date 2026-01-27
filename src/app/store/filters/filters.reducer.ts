import { createReducer, on } from '@ngrx/store';
import { FiltersState, initialFiltersState } from './filters.state';
import * as FiltersActions from './filters.actions';

/**
 * Reducer pour la gestion des filtres globaux
 */
export const filtersReducer = createReducer(
    initialFiltersState,

    // ========== Set Filters ==========
    on(FiltersActions.setStatutFilter, (state, { statut }) => ({
        ...state,
        statut
    })),

    on(FiltersActions.setDateRange, (state, { dateDebut, dateFin }) => ({
        ...state,
        dateDebut,
        dateFin
    })),

    on(FiltersActions.setDateDebut, (state, { dateDebut }) => ({
        ...state,
        dateDebut
    })),

    on(FiltersActions.setDateFin, (state, { dateFin }) => ({
        ...state,
        dateFin
    })),

    on(FiltersActions.setZoneFilter, (state, { zoneId }) => ({
        ...state,
        zoneId
    })),

    on(FiltersActions.setLivreurFilter, (state, { livreurId }) => ({
        ...state,
        livreurId
    })),

    on(FiltersActions.setSearchTerm, (state, { searchTerm }) => ({
        ...state,
        searchTerm
    })),

    on(FiltersActions.setPrioriteFilter, (state, { priorite }) => ({
        ...state,
        priorite
    })),

    // ========== Clear Specific Filters ==========
    on(FiltersActions.clearStatutFilter, (state) => ({
        ...state,
        statut: null
    })),

    on(FiltersActions.clearDateFilters, (state) => ({
        ...state,
        dateDebut: null,
        dateFin: null
    })),

    on(FiltersActions.clearZoneFilter, (state) => ({
        ...state,
        zoneId: null
    })),

    on(FiltersActions.clearLivreurFilter, (state) => ({
        ...state,
        livreurId: null
    })),

    on(FiltersActions.clearSearchTerm, (state) => ({
        ...state,
        searchTerm: null
    })),

    on(FiltersActions.clearPrioriteFilter, (state) => ({
        ...state,
        priorite: null
    })),

    // ========== Reset All Filters ==========
    on(FiltersActions.resetFilters, () => initialFiltersState)
);
