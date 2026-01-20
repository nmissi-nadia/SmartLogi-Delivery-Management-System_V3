import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ColisService } from '../../core/services/colis.service';
import * as ColisActions from './colis.actions';

/**
 * Effects pour gérer les opérations asynchrones sur les colis
 */
@Injectable()
export class ColisEffects {
    private actions$ = inject(Actions);
    private colisService = inject(ColisService);

    /**
     * Effect pour charger tous les colis
     */
    loadColis$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ColisActions.loadColis),
            switchMap(() =>
                this.colisService.getAllColis().pipe(
                    map(colis => ColisActions.loadColisSuccess({ colis })),
                    catchError(error =>
                        of(ColisActions.loadColisFailure({
                            error: error.message || 'Erreur lors du chargement des colis'
                        }))
                    )
                )
            )
        )
    );

    /**
     * Effect pour charger les colis d'un client
     */
    loadColisByClient$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ColisActions.loadColisByClient),
            switchMap(({ clientId }) =>
                this.colisService.getColisByClient(clientId).pipe(
                    map(colis => ColisActions.loadColisByClientSuccess({ colis })),
                    catchError(error =>
                        of(ColisActions.loadColisFailure({
                            error: error.message || 'Erreur lors du chargement des colis'
                        }))
                    )
                )
            )
        )
    );

    /**
     * Effect pour mettre à jour le statut d'un colis
     */
    updateColisStatut$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ColisActions.updateColisStatut),
            switchMap(({ colisId, statut }) =>
                this.colisService.updateStatut(colisId, statut).pipe(
                    map(colis => ColisActions.updateColisStatutSuccess({ colis })),
                    catchError(error =>
                        of(ColisActions.updateColisStatutFailure({
                            error: error.message || 'Erreur lors de la mise à jour du statut'
                        }))
                    )
                )
            )
        )
    );
}
