import { createAction, props } from '@ngrx/store';
import { Zone, CreateZoneDTO } from '../../core/services/zone.service';

/**
 * Actions pour la gestion des zones
 */

// ========== Load All Zones ==========
export const loadZones = createAction('[Zones] Load Zones');

export const loadZonesSuccess = createAction(
    '[Zones] Load Zones Success',
    props<{ zones: Zone[] }>()
);

export const loadZonesFailure = createAction(
    '[Zones] Load Zones Failure',
    props<{ error: string }>()
);

// ========== Load Zone By Id ==========
export const loadZoneById = createAction(
    '[Zones] Load Zone By Id',
    props<{ id: string }>()
);

export const loadZoneByIdSuccess = createAction(
    '[Zones] Load Zone By Id Success',
    props<{ zone: Zone }>()
);

export const loadZoneByIdFailure = createAction(
    '[Zones] Load Zone By Id Failure',
    props<{ error: string }>()
);

// ========== Create Zone ==========
export const createZone = createAction(
    '[Zones] Create Zone',
    props<{ zone: CreateZoneDTO }>()
);

export const createZoneSuccess = createAction(
    '[Zones] Create Zone Success',
    props<{ zone: Zone }>()
);

export const createZoneFailure = createAction(
    '[Zones] Create Zone Failure',
    props<{ error: string }>()
);

// ========== Update Zone ==========
export const updateZone = createAction(
    '[Zones] Update Zone',
    props<{ id: string; zone: Partial<CreateZoneDTO> }>()
);

export const updateZoneSuccess = createAction(
    '[Zones] Update Zone Success',
    props<{ zone: Zone }>()
);

export const updateZoneFailure = createAction(
    '[Zones] Update Zone Failure',
    props<{ error: string }>()
);

// ========== Delete Zone ==========
export const deleteZone = createAction(
    '[Zones] Delete Zone',
    props<{ id: string }>()
);

export const deleteZoneSuccess = createAction(
    '[Zones] Delete Zone Success',
    props<{ id: string }>()
);

export const deleteZoneFailure = createAction(
    '[Zones] Delete Zone Failure',
    props<{ error: string }>()
);

// ========== Select Zone ==========
export const selectZone = createAction(
    '[Zones] Select Zone',
    props<{ id: string }>()
);

export const clearSelectedZone = createAction(
    '[Zones] Clear Selected Zone'
);
