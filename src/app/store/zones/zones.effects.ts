import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ZoneService } from '../../core/services/zone.service';
import * as ZonesActions from './zones.actions';

/**
 * Effects pour gérer les opérations asynchrones sur les zones
 */
@Injectable()
export class ZonesEffects {
    private actions$ = inject(Actions);
    private zoneService = inject(ZoneService);

    loadZones$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ZonesActions.loadZones),
            switchMap(() =>
                this.zoneService.getZones().pipe(
                    map(zones => ZonesActions.loadZonesSuccess({ zones })),
                    catchError(error =>
                        of(ZonesActions.loadZonesFailure({
                            error: error.message || 'Erreur lors du chargement des zones'
                        }))
                    )
                )
            )
        )
    );

    loadZoneById$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ZonesActions.loadZoneById),
            switchMap(({ id }) =>
                this.zoneService.getZoneById(id).pipe(
                    map(zone => ZonesActions.loadZoneByIdSuccess({ zone })),
                    catchError(error =>
                        of(ZonesActions.loadZoneByIdFailure({
                            error: error.message || 'Erreur lors du chargement de la zone'
                        }))
                    )
                )
            )
        )
    );

    createZone$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ZonesActions.createZone),
            switchMap(({ zone }) =>
                this.zoneService.createZone(zone).pipe(
                    map(newZone => ZonesActions.createZoneSuccess({ zone: newZone })),
                    catchError(error =>
                        of(ZonesActions.createZoneFailure({
                            error: error.message || 'Erreur lors de la création de la zone'
                        }))
                    )
                )
            )
        )
    );

    updateZone$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ZonesActions.updateZone),
            switchMap(({ id, zone }) =>
                this.zoneService.updateZone(id, zone).pipe(
                    map(updatedZone => ZonesActions.updateZoneSuccess({ zone: updatedZone })),
                    catchError(error =>
                        of(ZonesActions.updateZoneFailure({
                            error: error.message || 'Erreur lors de la mise à jour de la zone'
                        }))
                    )
                )
            )
        )
    );

    deleteZone$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ZonesActions.deleteZone),
            switchMap(({ id }) =>
                this.zoneService.deleteZone(id).pipe(
                    map(() => ZonesActions.deleteZoneSuccess({ id })),
                    catchError(error =>
                        of(ZonesActions.deleteZoneFailure({
                            error: error.message || 'Erreur lors de la suppression de la zone'
                        }))
                    )
                )
            )
        )
    );
}
