import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';
import { AppState } from '../../store';
import * as AuthSelectors from '../../store/auth/auth.selectors';
import * as AuthActions from '../../store/auth/auth.actions';

/**
 * Resolver pour charger le profil de l'utilisateur connecté
 */
export const userProfileResolver: ResolveFn<any> = (route, state) => {
    const store = inject(Store<AppState>);

    // Dispatch l'action pour charger l'utilisateur
    store.dispatch(AuthActions.loadUser());

    // Attendre que l'utilisateur soit chargé
    return store.select(AuthSelectors.selectCurrentUser).pipe(
        filter(user => user !== null),
        take(1)
    );
};
