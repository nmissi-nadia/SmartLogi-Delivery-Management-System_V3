import { createReducer, on } from '@ngrx/store';
import { ZonesState, initialZonesState } from './zones.state';
import * as ZonesActions from './zones.actions';

/**
 * Reducer pour la gestion des zones
 */
export const zonesReducer = createReducer(
    initialZonesState,

    // ========== Load Zones ==========
    on(ZonesActions.loadZones, (state): ZonesState => ({
        ...state,
        loading: true,
        error: null
    })),

    on(ZonesActions.loadZonesSuccess, (state, { zones }): ZonesState => ({
        ...state,
        zones,
        loading: false,
        error: null
    })),

    on(ZonesActions.loadZonesFailure, (state, { error }): ZonesState => ({
        ...state,
        loading: false,
        error
    })),

    // ========== Load Zone By Id ==========
    on(ZonesActions.loadZoneById, (state): ZonesState => ({
        ...state,
        loading: true,
        error: null
    })),

    on(ZonesActions.loadZoneByIdSuccess, (state, { zone }): ZonesState => ({
        ...state,
        selectedZone: zone,
        loading: false,
        error: null
    })),

    on(ZonesActions.loadZoneByIdFailure, (state, { error }): ZonesState => ({
        ...state,
        loading: false,
        error
    })),

    // ========== Create Zone ==========
    on(ZonesActions.createZone, (state): ZonesState => ({
        ...state,
        loading: true,
        error: null
    })),

    on(ZonesActions.createZoneSuccess, (state, { zone }): ZonesState => ({
        ...state,
        zones: [...state.zones, zone],
        loading: false,
        error: null
    })),

    on(ZonesActions.createZoneFailure, (state, { error }): ZonesState => ({
        ...state,
        loading: false,
        error
    })),

    // ========== Update Zone ==========
    on(ZonesActions.updateZone, (state): ZonesState => ({
        ...state,
        loading: true,
        error: null
    })),

    on(ZonesActions.updateZoneSuccess, (state, { zone }): ZonesState => ({
        ...state,
        zones: state.zones.map(z => z.id === zone.id ? zone : z),
        selectedZone: state.selectedZone?.id === zone.id ? zone : state.selectedZone,
        loading: false,
        error: null
    })),

    on(ZonesActions.updateZoneFailure, (state, { error }): ZonesState => ({
        ...state,
        loading: false,
        error
    })),

    // ========== Delete Zone ==========
    on(ZonesActions.deleteZone, (state): ZonesState => ({
        ...state,
        loading: true,
        error: null
    })),

    on(ZonesActions.deleteZoneSuccess, (state, { id }): ZonesState => ({
        ...state,
        zones: state.zones.filter(z => z.id !== id),
        selectedZone: state.selectedZone?.id === id ? null : state.selectedZone,
        loading: false,
        error: null
    })),

    on(ZonesActions.deleteZoneFailure, (state, { error }): ZonesState => ({
        ...state,
        loading: false,
        error
    })),

    // ========== Select Zone ==========
    on(ZonesActions.selectZone, (state, { id }): ZonesState => ({
        ...state,
        selectedZone: state.zones.find(z => z.id === id) || null
    })),

    on(ZonesActions.clearSelectedZone, (state): ZonesState => ({
        ...state,
        selectedZone: null
    }))
);
