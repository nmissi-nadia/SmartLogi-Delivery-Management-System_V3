import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { LivreurService } from '../../core/services/livreur.service';
import * as LivreursActions from './livreurs.actions';

/**
 * Effects pour gérer les opérations asynchrones sur les livreurs
 */
@Injectable()
export class LivreursEffects {
    private actions$ = inject(Actions);
    private livreurService = inject(LivreurService);

    loadLivreurs$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LivreursActions.loadLivreurs),
            switchMap(() =>
                this.livreurService.getAllLivreurs().pipe(
                    map(livreurs => LivreursActions.loadLivreursSuccess({ livreurs })),
                    catchError(error =>
                        of(LivreursActions.loadLivreursFailure({
                            error: error.message || 'Erreur lors du chargement des livreurs'
                        }))
                    )
                )
            )
        )
    );

    loadLivreurById$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LivreursActions.loadLivreurById),
            switchMap(({ id }) =>
                this.livreurService.getLivreurById(id).pipe(
                    map(livreur => LivreursActions.loadLivreurByIdSuccess({ livreur })),
                    catchError(error =>
                        of(LivreursActions.loadLivreurByIdFailure({
                            error: error.message || 'Erreur lors du chargement du livreur'
                        }))
                    )
                )
            )
        )
    );

    createLivreur$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LivreursActions.createLivreur),
            switchMap(({ livreur }) =>
                this.livreurService.createLivreur(livreur).pipe(
                    map(newLivreur => LivreursActions.createLivreurSuccess({ livreur: newLivreur })),
                    catchError(error =>
                        of(LivreursActions.createLivreurFailure({
                            error: error.message || 'Erreur lors de la création du livreur'
                        }))
                    )
                )
            )
        )
    );

    updateLivreur$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LivreursActions.updateLivreur),
            switchMap(({ id, livreur }) =>
                this.livreurService.updateLivreur(id, livreur).pipe(
                    map(updatedLivreur => LivreursActions.updateLivreurSuccess({ livreur: updatedLivreur })),
                    catchError(error =>
                        of(LivreursActions.updateLivreurFailure({
                            error: error.message || 'Erreur lors de la mise à jour du livreur'
                        }))
                    )
                )
            )
        )
    );

    deleteLivreur$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LivreursActions.deleteLivreur),
            switchMap(({ id }) =>
                this.livreurService.deleteLivreur(id).pipe(
                    map(() => LivreursActions.deleteLivreurSuccess({ id })),
                    catchError(error =>
                        of(LivreursActions.deleteLivreurFailure({
                            error: error.message || 'Erreur lors de la suppression du livreur'
                        }))
                    )
                )
            )
        )
    );
}
