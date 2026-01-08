import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

/**
 * Interceptor HTTP pour ajouter automatiquement le token JWT à toutes les requêtes
 *
 * Fonctionnement :
 * - Intercepte toutes les requêtes HTTP sortantes
 * - Ajoute le header Authorization avec le token JWT si disponible
 * - Format : "Authorization: Bearer <token>"
 *
 * Configuration : Ajouté automatiquement via provideHttpClient(withInterceptors([jwtInterceptor]))
 */

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();

  const isAuthRoute = req.url.includes('/auth/login');
  if (token && !tokenService.isTokenExpired(token) && !isAuthRoute) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }
  return next(req);
};
