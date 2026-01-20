import { createAction, props } from '@ngrx/store';
import { Colis } from '../../core/services/colis.service';

/**
 * Actions pour charger tous les colis
 */
export const loadColis = createAction(
    '[Colis] Load Colis'
);

export const loadColisSuccess = createAction(
    '[Colis] Load Colis Success',
    props<{ colis: Colis[] }>()
);

export const loadColisFailure = createAction(
    '[Colis] Load Colis Failure',
    props<{ error: string }>()
);

/**
 * Actions pour charger les colis d'un client
 */
export const loadColisByClient = createAction(
    '[Colis] Load Colis By Client',
    props<{ clientId: string }>()
);

export const loadColisByClientSuccess = createAction(
    '[Colis] Load Colis By Client Success',
    props<{ colis: Colis[] }>()
);

/**
 * Actions pour sélectionner un colis
 */
export const selectColis = createAction(
    '[Colis] Select Colis',
    props<{ colisId: string }>()
);

export const clearSelectedColis = createAction(
    '[Colis] Clear Selected Colis'
);

/**
 * Actions pour mettre à jour le statut
 */
export const updateColisStatut = createAction(
    '[Colis] Update Statut',
    props<{ colisId: string; statut: string; commentaire: string }>()
);

export const updateColisStatutSuccess = createAction(
    '[Colis] Update Statut Success',
    props<{ colis: Colis }>()
);

export const updateColisStatutFailure = createAction(
    '[Colis] Update Statut Failure',
    props<{ error: string }>()
);

/**
 * Actions pour les filtres
 */
export const setStatutFilter = createAction(
    '[Colis] Set Statut Filter',
    props<{ statut: string }>()
);

export const setRechercheFilter = createAction(
    '[Colis] Set Recherche Filter',
    props<{ recherche: string }>()
);

export const clearFilters = createAction(
    '[Colis] Clear Filters'
);
