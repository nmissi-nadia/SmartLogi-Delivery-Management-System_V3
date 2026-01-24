import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ZonesState } from './zones.state';

/**
 * Selectors pour accéder à l'état des zones
 */

export const selectZonesState = createFeatureSelector<ZonesState>('zones');

export const selectAllZones = createSelector(
    selectZonesState,
    (state) => state.zones
);

export const selectSelectedZone = createSelector(
    selectZonesState,
    (state) => state.selectedZone
);

export const selectZonesLoading = createSelector(
    selectZonesState,
    (state) => state.loading
);

export const selectZonesError = createSelector(
    selectZonesState,
    (state) => state.error
);

export const selectZoneById = (id: string) => createSelector(
    selectAllZones,
    (zones) => zones.find(z => z.id === id)
);

export const selectZonesCount = createSelector(
    selectAllZones,
    (zones) => zones.length
);
