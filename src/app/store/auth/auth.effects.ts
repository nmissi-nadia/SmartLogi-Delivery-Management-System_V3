import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, tap } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { TokenService } from '../../core/services/token.service';
import * as AuthActions from './auth.actions';

/**
 * Effects pour gérer les side-effects de l'authentification
 * Gère les appels API asynchrones et les redirections
 */
@Injectable()
export class AuthEffects {
    private actions$ = inject(Actions);
    private authService = inject(AuthService);
    private tokenService = inject(TokenService);
    private router = inject(Router);

    /**
     * Effect pour gérer le login
     * Appelle l'API de login et dispatch loginSuccess ou loginFailure
     */
    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.login),
            exhaustMap(({ credentials }) =>
                this.authService.login(credentials).pipe(
                    map((response) => {
                        // Extraire les infos du token si pas de user dans la réponse
                        const user = response.user || {
                            id: 0,
                            username: this.tokenService.getUsernameFromToken() || '',
                            email: '',
                            roles: this.tokenService.getRolesFromToken() as any
                        };

                        return AuthActions.loginSuccess({
                            user,
                            token: response.token
                        });
                    }),
                    catchError((error) =>
                        of(AuthActions.loginFailure({
                            error: error.message || 'Erreur de connexion'
                        }))
                    )
                )
            )
        )
    );

    /**
     * Effect pour gérer le succès du login
     * Stocke le token et redirige l'utilisateur
     */
    loginSuccess$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AuthActions.loginSuccess),
                tap(({ token }) => {
                    this.tokenService.setToken(token);
                    this.authService.redirectByRole();
                })
            ),
        { dispatch: false }
    );

    /**
     * Effect pour gérer le logout
     * Supprime le token et redirige vers la page de login
     */
    logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.logout),
            map(() => {
                this.tokenService.removeToken();
                this.router.navigate(['/auth/login']);
                return AuthActions.logoutSuccess();
            })
        )
    );

    /**
     * Effect pour gérer l'inscription
     * Appelle l'API d'inscription et dispatch registerSuccess ou registerFailure
     */
    register$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.register),
            exhaustMap(({ registerData }) =>
                this.authService.register(registerData).pipe(
                    map((response) =>
                        AuthActions.registerSuccess({
                            user: response.user,
                            token: response.token
                        })
                    ),
                    catchError((error) =>
                        of(AuthActions.registerFailure({
                            error: error.message || 'Erreur d\'inscription'
                        }))
                    )
                )
            )
        )
    );

    /**
     * Effect pour gérer le succès de l'inscription
     * Stocke le token et redirige l'utilisateur
     */
    registerSuccess$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AuthActions.registerSuccess),
                tap(({ token }) => {
                    this.tokenService.setToken(token);
                    this.authService.redirectByRole();
                })
            ),
        { dispatch: false }
    );

    /**
     * Effect pour vérifier l'authentification au démarrage
     * Vérifie si un token valide existe et charge les infos utilisateur
     */
    checkAuth$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.checkAuth),
            map(() => {
                const token = this.tokenService.getToken();

                if (token && !this.tokenService.isTokenExpired(token)) {
                    const userInfo = this.authService.getUserInfo();

                    if (userInfo) {
                        const user = {
                            id: parseInt(userInfo.userId) || 0,
                            username: userInfo.username,
                            email: '',
                            roles: userInfo.roles as any
                        };

                        return AuthActions.checkAuthSuccess({ user, token });
                    }
                }

                return AuthActions.checkAuthFailure();
            })
        )
    );

    /**
     * Effect pour charger les détails de l'utilisateur
     * Peut être utilisé pour récupérer les infos complètes depuis le backend
     */
    loadUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.loadUser),
            exhaustMap(() => {
                // Pour l'instant, on récupère les infos du token
                // TODO: Implémenter un appel API pour récupérer le profil complet
                const userInfo = this.authService.getUserInfo();

                if (userInfo) {
                    const user = {
                        id: parseInt(userInfo.userId) || 0,
                        username: userInfo.username,
                        email: '',
                        roles: userInfo.roles as any
                    };

                    return of(AuthActions.loadUserSuccess({ user }));
                }

                return of(AuthActions.loadUserFailure({
                    error: 'Impossible de charger les informations utilisateur'
                }));
            })
        )
    );
}
