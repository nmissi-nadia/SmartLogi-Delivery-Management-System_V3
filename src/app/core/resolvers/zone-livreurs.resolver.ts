import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';
import { AppState } from '../../store';
import * as LivreursActions from '../../store/livreurs/livreurs.actions';
import * as LivreursSelectors from '../../store/livreurs/livreurs.selectors';

/**
 * Resolver pour charger les livreurs d'une zone spécifique
 */
export const zoneLivreursResolver: ResolveFn<any> = (route, state) => {
    const store = inject(Store<AppState>);
    const zoneId = route.paramMap.get('zoneId');

    if (zoneId) {
        store.dispatch(LivreursActions.loadLivreurs()); // On pourrait filtrer côté serveur si l'API le permet

        return store.select(LivreursSelectors.selectLivreursByZone(zoneId)).pipe(
            filter(livreurs => livreurs.length > 0),
            take(1)
        );
    }

    return [];
};
