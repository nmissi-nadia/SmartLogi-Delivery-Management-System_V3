import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * Service pour gérer le stockage et la récupération du token JWT
 * Utilise localStorage pour persister le token entre les sessions
 */
@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private readonly TOKEN_KEY = environment.tokenKey;

    /**
     * Stocke le token JWT dans le localStorage
     * @param token - Le token JWT à stocker
     */
    setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    /**
     * Récupère le token JWT depuis le localStorage
     * @returns Le token JWT ou null s'il n'existe pas
     */
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    /**
     * Supprime le token JWT du localStorage
     */
    removeToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    /**
     * Vérifie si un token existe
     * @returns true si un token est présent, false sinon
     */
    hasToken(): boolean {
        return this.getToken() !== null;
    }

    /**
     * Décode le payload du JWT sans vérifier la signature
     * ATTENTION: Ne pas utiliser pour valider le token, seulement pour lire les informations
     * @param token - Le token JWT à décoder
     * @returns Le payload décodé ou null en cas d'erreur
     */
    decodeToken(token: string): any {
        try {
            const payload = token.split('.')[1];
            return JSON.parse(atob(payload));
        } catch (error) {
            console.error('Erreur lors du décodage du token:', error);
            return null;
        }
    }

    /**
     * Vérifie si le token est expiré
     * @param token - Le token JWT à vérifier
     * @returns true si le token est expiré, false sinon
     */
    isTokenExpired(token: string): boolean {
        const decoded = this.decodeToken(token);
        if (!decoded || !decoded.exp) {
            return true;
        }

        const expirationDate = new Date(decoded.exp * 1000);
        return expirationDate < new Date();
    }

    /**
     * Récupère les rôles depuis le token
     * @returns Un tableau de rôles ou un tableau vide
     */
    getRolesFromToken(): string[] {
        const token = this.getToken();
        if (!token) {
            return [];
        }

        const decoded = this.decodeToken(token);
        return decoded?.roles || decoded?.authorities || [];
    }

    /**
     * Récupère le username depuis le token
     * @returns Le username ou null
     */
    getUsernameFromToken(): string | null {
        const token = this.getToken();
        if (!token) {
            return null;
        }

        const decoded = this.decodeToken(token);
        return decoded?.sub || decoded?.username || null;
    }
}
