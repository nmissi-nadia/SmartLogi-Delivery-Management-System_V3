import { createAction, props } from '@ngrx/store';

/**
 * Actions pour la gestion des filtres globaux
 */

// ========== Filtre par statut ==========
export const setStatutFilter = createAction(
    '[Filters] Set Statut',
    props<{ statut: string | null }>()
);

// ========== Filtre par plage de dates ==========
export const setDateRange = createAction(
    '[Filters] Set Date Range',
    props<{ dateDebut: string | null; dateFin: string | null }>()
);

export const setDateDebut = createAction(
    '[Filters] Set Date Debut',
    props<{ dateDebut: string | null }>()
);

export const setDateFin = createAction(
    '[Filters] Set Date Fin',
    props<{ dateFin: string | null }>()
);

// ========== Filtre par zone ==========
export const setZoneFilter = createAction(
    '[Filters] Set Zone',
    props<{ zoneId: string | null }>()
);

// ========== Filtre par livreur ==========
export const setLivreurFilter = createAction(
    '[Filters] Set Livreur',
    props<{ livreurId: string | null }>()
);

// ========== Filtre par terme de recherche ==========
export const setSearchTerm = createAction(
    '[Filters] Set Search Term',
    props<{ searchTerm: string | null }>()
);

// ========== Filtre par priorité ==========
export const setPrioriteFilter = createAction(
    '[Filters] Set Priorite',
    props<{ priorite: string | null }>()
);

// ========== Réinitialiser tous les filtres ==========
export const resetFilters = createAction('[Filters] Reset');

// ========== Réinitialiser un filtre spécifique ==========
export const clearStatutFilter = createAction('[Filters] Clear Statut');
export const clearDateFilters = createAction('[Filters] Clear Dates');
export const clearZoneFilter = createAction('[Filters] Clear Zone');
export const clearLivreurFilter = createAction('[Filters] Clear Livreur');
export const clearSearchTerm = createAction('[Filters] Clear Search');
export const clearPrioriteFilter = createAction('[Filters] Clear Priorite');
