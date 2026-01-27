import { ActionReducerMap } from '@ngrx/store';
import { AuthState } from './auth/auth.state';
import { ColisState } from './colis/colis.state';
import { FiltersState } from './filters/filters.state';
import { LivreursState } from './livreurs/livreurs.state';
import { ClientsState } from './clients/clients.state';
import { ZonesState } from './zones/zones.state';

import { authReducer } from './auth/auth.reducer';
import { colisReducer } from './colis/colis.reducer';
import { filtersReducer } from './filters/filters.reducer';
import { livreursReducer } from './livreurs/livreurs.reducer';
import { clientsReducer } from './clients/clients.reducer';
import { zonesReducer } from './zones/zones.reducer';

/**
 * Interface globale de l'état de l'application
 * Combine tous les états des différents stores
 */
export interface AppState {
    auth: AuthState;
    colis: ColisState;
    filters: FiltersState;
    livreurs: LivreursState;
    clients: ClientsState;
    zones: ZonesState;
}

/**
 * Map des reducers de l'application
 * Utilisé pour configurer le store global
 */
export const appReducers: ActionReducerMap<AppState> = {
    auth: authReducer,
    colis: colisReducer,
    filters: filtersReducer,
    livreurs: livreursReducer,
    clients: clientsReducer,
    zones: zonesReducer
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

export * from './livreurs/livreurs.state';
export * from './livreurs/livreurs.actions';
export * from './livreurs/livreurs.selectors';

export * from './clients/clients.state';
export * from './clients/clients.actions';
export * from './clients/clients.selectors';

export * from './zones/zones.state';
export * from './zones/zones.actions';
export * from './zones/zones.selectors';

