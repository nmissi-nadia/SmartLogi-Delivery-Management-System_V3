import { Role } from './role.enum';

/**
 * Modèle représentant un utilisateur de l'application
 * Ce modèle doit correspondre à la structure de l'utilisateur retourné par le backend
 */
export interface User {
    id: number;
    username: string;
    email: string;
    nom?: string;
    prenom?: string;
    roles: Role[];
    telephone?: string;
    adresse?: string;
}

/**
 * Modèle pour les credentials de connexion
 */
export interface LoginCredentials {
    username: string;
    password: string;
}

/**
 * Modèle pour l'inscription d'un nouveau client
 */
export interface RegisterData {
    username: string;
    email: string;
    password: string;
    nom: string;
    prenom: string;
    telephone?: string;
    adresse?: string;
}
