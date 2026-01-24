import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

// Import du store global
import { appReducers } from './store';

// Import des effects
import { AuthEffects } from './store/auth/auth.effects';
import { ColisEffects } from './store/colis/colis.effects';
import { LivreursEffects } from './store/livreurs/livreurs.effects';
import { ClientsEffects } from './store/clients/clients.effects';
import { ZonesEffects } from './store/zones/zones.effects';

/**
 * Configuration globale de l'application Angular
 * Inclut le routing, HTTP client, NgRx Store, Effects et DevTools
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([jwtInterceptor, errorInterceptor])
    ),
    // NgRx Store avec tous les reducers (Auth, Colis, Filters, Livreurs, Clients, Zones)
    provideStore(appReducers),
    // NgRx Effects pour gérer les side-effects asynchrones
    provideEffects([
      AuthEffects,
      ColisEffects,
      LivreursEffects,
      ClientsEffects,
      ZonesEffects
    ]),
    // NgRx DevTools pour le debugging (uniquement en développement)
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
      connectInZone: true
    })
  ]
};
