import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor HTTP pour gérer globalement les erreurs
 * 
 * Fonctionnement :
 * - Intercepte toutes les réponses HTTP
 * - Gère les erreurs courantes (401, 403, 404, 500, etc.)
 * - Déconnecte automatiquement l'utilisateur en cas d'erreur 401
 * - Affiche des messages d'erreur appropriés
 * 
 * Configuration : Ajouté automatiquement via provideHttpClient(withInterceptors([errorInterceptor]))
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'Une erreur est survenue';

            if (error.error instanceof ErrorEvent) {
                // Erreur côté client
                errorMessage = `Erreur : ${error.error.message}`;
                console.error('Erreur côté client:', error.error.message);
            } else {
                // Erreur côté serveur
                switch (error.status) {
                    case 401:
                        // Non autorisé - Token invalide ou expiré
                        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
                        console.error('Erreur 401: Non autorisé');

                        // Déconnecter l'utilisateur
                        authService.logout();
                        break;

                    case 403:
                        // Accès interdit - Permissions insuffisantes
                        errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
                        console.error('Erreur 403: Accès interdit');
                        router.navigate(['/access-denied']);
                        break;

                    case 404:
                        // Ressource non trouvée
                        errorMessage = 'Ressource non trouvée.';
                        console.error('Erreur 404: Ressource non trouvée');
                        break;

                    case 500:
                        // Erreur serveur
                        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
                        console.error('Erreur 500: Erreur serveur interne');
                        break;

                    case 0:
                        // Erreur de connexion (serveur inaccessible)
                        errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion.';
                        console.error('Erreur 0: Serveur inaccessible');
                        break;

                    default:
                        errorMessage = error.error?.message || `Erreur ${error.status}: ${error.statusText}`;
                        console.error(`Erreur ${error.status}:`, error.message);
                }
            }

            // TODO: Intégrer un service de notification pour afficher les erreurs à l'utilisateur
            // Ex: notificationService.showError(errorMessage);

            // Retourner l'erreur pour que les composants puissent la gérer si nécessaire
            return throwError(() => ({
                status: error.status,
                message: errorMessage,
                originalError: error
            }));
        })
    );
};
