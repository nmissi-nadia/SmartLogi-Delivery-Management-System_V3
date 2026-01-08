import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';
import { User, LoginCredentials, RegisterData, Role } from '../models';
import { JwtResponse } from '../models/jwt-response.model';

/**
 * Service d'authentification
 * Gère la connexion, déconnexion et l'état de l'utilisateur connecté
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly tokenService = inject(TokenService);
    private readonly router = inject(Router);

    private readonly API_URL = environment.apiUrl;
    private readonly AUTH_ENDPOINT = `${this.API_URL}/auth`;

    // BehaviorSubject pour suivre l'état de l'utilisateur connecté
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    // BehaviorSubject pour suivre l'état d'authentification
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    constructor() {
        // Vérifier si un token existe au démarrage de l'application
        this.checkInitialAuth();
    }

    /**
     * Vérifie si un utilisateur est déjà authentifié au démarrage
     */
    private checkInitialAuth(): void {
        const token = this.tokenService.getToken();
        if (token && !this.tokenService.isTokenExpired(token)) {
            // TODO: Optionnel - Récupérer les infos utilisateur depuis le backend
            // Pour l'instant, on extrait les infos du token
            this.isAuthenticatedSubject.next(true);
        }
    }

    /**
     * Authentifie un utilisateur
     * @param credentials - Les identifiants de connexion (username, password)
     * @returns Observable de la réponse JWT
     */
    login(credentials: LoginCredentials): Observable<any> {
      return this.http.post<any>(`${this.AUTH_ENDPOINT}/login`, credentials)
        .pipe(
          tap(response => {
            // Stocker le token
            this.tokenService.setToken(response.token);

            // Extraire les infos du token
            const roles = this.tokenService.getRolesFromToken();
            const username = this.tokenService.getUsernameFromToken();

            // Créer un user minimal depuis le token
            const user: User = {
              id: 0,
              username: username || '',
              email: '',
              roles: roles as Role[]
            };

            // Mettre à jour l'état
            this.currentUserSubject.next(user);
            this.isAuthenticatedSubject.next(true);
          }),
          catchError(error => {
            console.error('Erreur de connexion:', error);
            return throwError(() => error);
          })
        );
    }

    /**
     * Inscrit un nouveau client
     * @param registerData - Les données d'inscription
     * @returns Observable de la réponse JWT
     */
    register(registerData: RegisterData): Observable<JwtResponse> {
        return this.http.post<JwtResponse>(`${this.AUTH_ENDPOINT}/register`, registerData)
            .pipe(
                tap(response => {
                    // Stocker le token
                    this.tokenService.setToken(response.token);

                    // Mettre à jour l'état de l'utilisateur
                    this.currentUserSubject.next(response.user);
                    this.isAuthenticatedSubject.next(true);
                }),
                catchError(error => {
                    console.error('Erreur d\'inscription:', error);
                    return throwError(() => error);
                })
            );
    }

    /**
     * Déconnecte l'utilisateur
     */
    logout(): void {
        // Supprimer le token
        this.tokenService.removeToken();

        // Réinitialiser l'état
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);

        // Rediriger vers la page de login
        this.router.navigate(['/auth/login']);
    }

    /**
     * Vérifie si l'utilisateur est authentifié
     * @returns true si authentifié, false sinon
     */
    isAuthenticated(): boolean {
        const token = this.tokenService.getToken();
        if (!token) {
            return false;
        }

        // Vérifier si le token n'est pas expiré
        if (this.tokenService.isTokenExpired(token)) {
            this.logout();
            return false;
        }

        return true;
    }

    /**
     * Récupère l'utilisateur actuellement connecté
     * @returns L'utilisateur ou null
     */
    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    /**
     * Vérifie si l'utilisateur a un rôle spécifique
     * @param role - Le rôle à vérifier
     * @returns true si l'utilisateur a le rôle, false sinon
     */
    hasRole(role: Role): boolean {
        const roles = this.tokenService.getRolesFromToken();
        return roles.includes(role);
    }

    /**
     * Vérifie si l'utilisateur a au moins un des rôles spécifiés
     * @param roles - Les rôles à vérifier
     * @returns true si l'utilisateur a au moins un des rôles, false sinon
     */
    hasAnyRole(roles: Role[]): boolean {
        const userRoles = this.tokenService.getRolesFromToken();
        return roles.some(role => userRoles.includes(role));
    }

    /**
     * Récupère les rôles de l'utilisateur connecté
     * @returns Un tableau de rôles
     */
    getUserRoles(): string[] {
        return this.tokenService.getRolesFromToken();
    }

    /**
     * Redirige l'utilisateur vers la page appropriée selon son rôle
     */
    redirectByRole(): void {
        const roles = this.getUserRoles();

        if (roles.includes(Role.GESTIONNAIRE)) {
            this.router.navigate(['/gestionnaire/dashboard']);
        } else if (roles.includes(Role.LIVREUR)) {
            this.router.navigate(['/livreur/mes-colis']);
        } else if (roles.includes(Role.CLIENT)) {
            this.router.navigate(['/client/mes-colis']);
        } else if (roles.includes(Role.DESTINATAIRE)) {
            this.router.navigate(['/destinataire/suivi-colis']);
        } else {
            this.router.navigate(['/']);
        }
    }
}
