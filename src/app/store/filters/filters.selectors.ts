import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FiltersState } from './filters.state';

/**
 * Selectors pour accéder à l'état des filtres
 */

// Sélecteur de feature pour l'état Filters
export const selectFiltersState = createFeatureSelector<FiltersState>('filters');

// Sélecteurs individuels pour chaque filtre
export const selectStatutFilter = createSelector(
    selectFiltersState,
    (state) => state.statut
);

export const selectDateDebutFilter = createSelector(
    selectFiltersState,
    (state) => state.dateDebut
);

export const selectDateFinFilter = createSelector(
    selectFiltersState,
    (state) => state.dateFin
);

export const selectDateRange = createSelector(
    selectFiltersState,
    (state) => ({
        dateDebut: state.dateDebut,
        dateFin: state.dateFin
    })
);

export const selectZoneFilter = createSelector(
    selectFiltersState,
    (state) => state.zoneId
);

export const selectLivreurFilter = createSelector(
    selectFiltersState,
    (state) => state.livreurId
);

export const selectSearchTerm = createSelector(
    selectFiltersState,
    (state) => state.searchTerm
);

export const selectPrioriteFilter = createSelector(
    selectFiltersState,
    (state) => state.priorite
);

// Sélecteur pour tous les filtres
export const selectAllFilters = createSelector(
    selectFiltersState,
    (state) => state
);

// Sélecteur pour vérifier si des filtres sont actifs
export const selectHasActiveFilters = createSelector(
    selectFiltersState,
    (state) =>
        state.statut !== null ||
        state.dateDebut !== null ||
        state.dateFin !== null ||
        state.zoneId !== null ||
        state.livreurId !== null ||
        state.searchTerm !== null ||
        state.priorite !== null
);

// Sélecteur pour compter le nombre de filtres actifs
export const selectActiveFiltersCount = createSelector(
    selectFiltersState,
    (state) => {
        let count = 0;
        if (state.statut !== null) count++;
        if (state.dateDebut !== null || state.dateFin !== null) count++;
        if (state.zoneId !== null) count++;
        if (state.livreurId !== null) count++;
        if (state.searchTerm !== null) count++;
        if (state.priorite !== null) count++;
        return count;
    }
);

// Sélecteur pour obtenir un objet de filtres pour les requêtes API
export const selectFiltersForApi = createSelector(
    selectFiltersState,
    (state) => {
        const filters: any = {};

        if (state.statut) filters.statut = state.statut;
        if (state.dateDebut) filters.dateDebut = state.dateDebut;
        if (state.dateFin) filters.dateFin = state.dateFin;
        if (state.zoneId) filters.zoneId = state.zoneId;
        if (state.livreurId) filters.livreurId = state.livreurId;
        if (state.searchTerm) filters.searchTerm = state.searchTerm;
        if (state.priorite) filters.priorite = state.priorite;

        return filters;
    }
);
