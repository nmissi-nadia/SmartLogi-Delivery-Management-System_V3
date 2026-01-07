import { User } from './user.model';

/**
 * Modèle représentant la réponse d'authentification JWT du backend
 * Adaptez cette structure selon la réponse exacte de votre API backend
 */
export interface JwtResponse {
    token: string;
    type?: string; // Ex: "Bearer"
    user: User;
}

/**
 * Modèle pour le payload décodé du JWT
 * Utilisé pour extraire les informations du token
 */
export interface JwtPayload {
    sub: string; // username
    roles: string[];
    exp: number; // expiration timestamp
    iat?: number; // issued at timestamp
}
