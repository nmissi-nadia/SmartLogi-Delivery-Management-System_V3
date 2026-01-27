import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ColisState } from './colis.state';

/**
 * Sélecteur de feature pour l'état des colis
 */
export const selectColisState = createFeatureSelector<ColisState>('colis');

/**
 * Sélecteurs pour accéder aux différentes parties de l'état
 */
export const selectAllColis = createSelector(
    selectColisState,
    (state: ColisState) => state.colis
);

export const selectColisLoading = createSelector(
    selectColisState,
    (state: ColisState) => state.loading
);

export const selectColisError = createSelector(
    selectColisState,
    (state: ColisState) => state.error
);

export const selectSelectedColis = createSelector(
    selectColisState,
    (state: ColisState) => state.selectedColis
);

export const selectColisFilters = createSelector(
    selectColisState,
    (state: ColisState) => state.filters
);

/**
 * Sélecteur pour les colis filtrés
 */
export const selectFilteredColis = createSelector(
    selectAllColis,
    selectColisFilters,
    (colis, filters) => {
        let filtered = colis;

        // Filtre par statut
        if (filters.statut && filters.statut !== 'tous') {
            filtered = filtered.filter(c => c.statut === filters.statut);
        }

        // Filtre par recherche
        if (filters.recherche) {
            const search = filters.recherche.toLowerCase();
            filtered = filtered.filter(c =>
                c.description?.toLowerCase().includes(search) ||
                c.id.toLowerCase().includes(search)
            );
        }

        return filtered;
    }
);

/**
 * Sélecteur pour compter les colis par statut
 */
export const selectColisCountByStatut = createSelector(
    selectAllColis,
    (colis) => ({
        total: colis.length,
        cree: colis.filter(c => c.statut === 'CREE').length,
        collecte: colis.filter(c => c.statut === 'COLLECTE').length,
        enTransit: colis.filter(c => c.statut === 'EN_TRANSIT').length,
        livre: colis.filter(c => c.statut === 'LIVRE').length
    })
);
