import { User } from '../../core/models';

/**
 * État de l'authentification
 * Centralise toutes les informations relatives à l'utilisateur connecté
 */
export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

/**
 * État initial de l'authentification
 */
export const initialAuthState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
};
