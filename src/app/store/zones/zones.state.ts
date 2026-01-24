import { Zone } from '../../core/services/zone.service';

/**
 * État de la gestion des zones
 */
export interface ZonesState {
    zones: Zone[];
    selectedZone: Zone | null;
    loading: boolean;
    error: string | null;
}

/**
 * État initial des zones
 */
export const initialZonesState: ZonesState = {
    zones: [],
    selectedZone: null,
    loading: false,
    error: null
};
