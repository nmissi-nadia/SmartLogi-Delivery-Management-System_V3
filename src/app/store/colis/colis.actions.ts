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
 * Actions pour charger un colis par ID
 */
export const loadColisById = createAction(
    '[Colis] Load Colis By Id',
    props<{ colisId: string }>()
);

export const loadColisByIdSuccess = createAction(
    '[Colis] Load Colis By Id Success',
    props<{ colis: Colis }>()
);

export const loadColisByIdFailure = createAction(
    '[Colis] Load Colis By Id Failure',
    props<{ error: string }>()
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
 * Actions pour les filtres locaux des colis
 * Note: Pour les filtres globaux, utiliser le store Filters
 */
export const setColisStatutFilter = createAction(
    '[Colis] Set Colis Statut Filter',
    props<{ statut: string }>()
);

export const setColisRechercheFilter = createAction(
    '[Colis] Set Colis Recherche Filter',
    props<{ recherche: string }>()
);

export const clearColisFilters = createAction(
    '[Colis] Clear Colis Filters'
);
