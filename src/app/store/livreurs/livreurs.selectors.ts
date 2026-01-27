import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LivreursState } from './livreurs.state';

/**
 * Selectors pour accéder à l'état des livreurs
 */

export const selectLivreursState = createFeatureSelector<LivreursState>('livreurs');

export const selectAllLivreurs = createSelector(
    selectLivreursState,
    (state) => state.livreurs
);

export const selectSelectedLivreur = createSelector(
    selectLivreursState,
    (state) => state.selectedLivreur
);

export const selectLivreursLoading = createSelector(
    selectLivreursState,
    (state) => state.loading
);

export const selectLivreursError = createSelector(
    selectLivreursState,
    (state) => state.error
);

export const selectLivreurById = (id: string) => createSelector(
    selectAllLivreurs,
    (livreurs) => livreurs.find(l => l.id === id)
);

export const selectLivreursByZone = (zoneId: string) => createSelector(
    selectAllLivreurs,
    (livreurs) => livreurs.filter(l => l.zoneId === zoneId)
);

export const selectLivreursCount = createSelector(
    selectAllLivreurs,
    (livreurs) => livreurs.length
);
