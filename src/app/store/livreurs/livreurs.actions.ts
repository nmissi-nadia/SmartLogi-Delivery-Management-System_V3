import { createAction, props } from '@ngrx/store';
import { Livreur, CreateLivreurDTO } from '../../core/services/livreur.service';

/**
 * Actions pour la gestion des livreurs
 */

// ========== Load All Livreurs ==========
export const loadLivreurs = createAction('[Livreurs] Load Livreurs');

export const loadLivreursSuccess = createAction(
    '[Livreurs] Load Livreurs Success',
    props<{ livreurs: Livreur[] }>()
);

export const loadLivreursFailure = createAction(
    '[Livreurs] Load Livreurs Failure',
    props<{ error: string }>()
);

// ========== Load Livreur By Id ==========
export const loadLivreurById = createAction(
    '[Livreurs] Load Livreur By Id',
    props<{ id: string }>()
);

export const loadLivreurByIdSuccess = createAction(
    '[Livreurs] Load Livreur By Id Success',
    props<{ livreur: Livreur }>()
);

export const loadLivreurByIdFailure = createAction(
    '[Livreurs] Load Livreur By Id Failure',
    props<{ error: string }>()
);

// ========== Create Livreur ==========
export const createLivreur = createAction(
    '[Livreurs] Create Livreur',
    props<{ livreur: CreateLivreurDTO }>()
);

export const createLivreurSuccess = createAction(
    '[Livreurs] Create Livreur Success',
    props<{ livreur: Livreur }>()
);

export const createLivreurFailure = createAction(
    '[Livreurs] Create Livreur Failure',
    props<{ error: string }>()
);

// ========== Update Livreur ==========
export const updateLivreur = createAction(
    '[Livreurs] Update Livreur',
    props<{ id: string; livreur: Partial<CreateLivreurDTO> }>()
);

export const updateLivreurSuccess = createAction(
    '[Livreurs] Update Livreur Success',
    props<{ livreur: Livreur }>()
);

export const updateLivreurFailure = createAction(
    '[Livreurs] Update Livreur Failure',
    props<{ error: string }>()
);

// ========== Delete Livreur ==========
export const deleteLivreur = createAction(
    '[Livreurs] Delete Livreur',
    props<{ id: string }>()
);

export const deleteLivreurSuccess = createAction(
    '[Livreurs] Delete Livreur Success',
    props<{ id: string }>()
);

export const deleteLivreurFailure = createAction(
    '[Livreurs] Delete Livreur Failure',
    props<{ error: string }>()
);

// ========== Select Livreur ==========
export const selectLivreur = createAction(
    '[Livreurs] Select Livreur',
    props<{ id: string }>()
);

export const clearSelectedLivreur = createAction(
    '[Livreurs] Clear Selected Livreur'
);
