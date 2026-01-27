import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ClientService } from '../../core/services/client.service';
import * as ClientsActions from './clients.actions';

/**
 * Effects pour gérer les opérations asynchrones sur les clients
 */
@Injectable()
export class ClientsEffects {
    private actions$ = inject(Actions);
    private clientService = inject(ClientService);

    loadClients$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ClientsActions.loadClients),
            switchMap(() =>
                this.clientService.getAllClients().pipe(
                    map(clients => ClientsActions.loadClientsSuccess({ clients })),
                    catchError(error =>
                        of(ClientsActions.loadClientsFailure({
                            error: error.message || 'Erreur lors du chargement des clients'
                        }))
                    )
                )
            )
        )
    );

    loadClientById$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ClientsActions.loadClientById),
            switchMap(({ id }) =>
                this.clientService.getClientById(id).pipe(
                    map(client => ClientsActions.loadClientByIdSuccess({ client })),
                    catchError(error =>
                        of(ClientsActions.loadClientByIdFailure({
                            error: error.message || 'Erreur lors du chargement du client'
                        }))
                    )
                )
            )
        )
    );

    searchClients$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ClientsActions.searchClients),
            switchMap(({ keyword, page, size }) =>
                this.clientService.searchClients(keyword, page, size).pipe(
                    map(response => ClientsActions.searchClientsSuccess({ clients: response.content })),
                    catchError(error =>
                        of(ClientsActions.searchClientsFailure({
                            error: error.message || 'Erreur lors de la recherche de clients'
                        }))
                    )
                )
            )
        )
    );

    createClient$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ClientsActions.createClient),
            switchMap(({ client }) =>
                this.clientService.createClient(client).pipe(
                    map(newClient => ClientsActions.createClientSuccess({ client: newClient })),
                    catchError(error =>
                        of(ClientsActions.createClientFailure({
                            error: error.message || 'Erreur lors de la création du client'
                        }))
                    )
                )
            )
        )
    );

    updateClient$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ClientsActions.updateClient),
            switchMap(({ id, client }) =>
                this.clientService.updateClient(id, client).pipe(
                    map(updatedClient => ClientsActions.updateClientSuccess({ client: updatedClient })),
                    catchError(error =>
                        of(ClientsActions.updateClientFailure({
                            error: error.message || 'Erreur lors de la mise à jour du client'
                        }))
                    )
                )
            )
        )
    );

    deleteClient$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ClientsActions.deleteClient),
            switchMap(({ id }) =>
                this.clientService.deleteClient(id).pipe(
                    map(() => ClientsActions.deleteClientSuccess({ id })),
                    catchError(error =>
                        of(ClientsActions.deleteClientFailure({
                            error: error.message || 'Erreur lors de la suppression du client'
                        }))
                    )
                )
            )
        )
    );
}
