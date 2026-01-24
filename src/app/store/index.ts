import { ActionReducerMap } from '@ngrx/store';
import { AuthState } from './auth/auth.state';
import { ColisState } from './colis/colis.state';
import { FiltersState } from './filters/filters.state';
import { authReducer } from './auth/auth.reducer';
import { colisReducer } from './colis/colis.reducer';
import { filtersReducer } from './filters/filters.reducer';

/**
 * Interface globale de l'état de l'application
 * Combine tous les états des différents stores
 */
export interface AppState {
    auth: AuthState;
    colis: ColisState;
    filters: FiltersState;
}

/**
 * Map des reducers de l'application
 * Utilisé pour configurer le store global
 */
export const appReducers: ActionReducerMap<AppState> = {
    auth: authReducer,
    colis: colisReducer,
    filters: filtersReducer
};

/**
 * Export des types et interfaces pour faciliter l'utilisation
 */
export * from './auth/auth.state';
export * from './auth/auth.actions';
export * from './auth/auth.selectors';

export * from './colis/colis.state';
export * from './colis/colis.actions';
export * from './colis/colis.selectors';

export * from './filters/filters.state';
export * from './filters/filters.actions';
export * from './filters/filters.selectors';
