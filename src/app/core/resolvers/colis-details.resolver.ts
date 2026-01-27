import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';
import { AppState } from '../../store';
import * as ColisActions from '../../store/colis/colis.actions';
import * as ColisSelectors from '../../store/colis/colis.selectors';

/**
 * Resolver pour charger les détails d'un colis spécifique
 */
export const colisDetailsResolver: ResolveFn<any> = (route, state) => {
    const store = inject(Store<AppState>);
    const colisId = route.paramMap.get('id');

    if (colisId) {
        store.dispatch(ColisActions.loadColisById({ colisId }));

        return store.select(ColisSelectors.selectSelectedColis).pipe(
            filter(colis => colis !== null),
            take(1)
        );
    }

    return null;
};
