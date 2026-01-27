import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

/**
 * Selectors pour accéder à l'état d'authentification
 */

// Sélecteur de feature pour l'état Auth
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// Sélecteur pour l'utilisateur actuel
export const selectCurrentUser = createSelector(
    selectAuthState,
    (state) => state.user
);

// Sélecteur pour le statut d'authentification
export const selectIsAuthenticated = createSelector(
    selectAuthState,
    (state) => state.isAuthenticated
);

// Sélecteur pour le token JWT
export const selectAuthToken = createSelector(
    selectAuthState,
    (state) => state.token
);

// Sélecteur pour l'état de chargement
export const selectAuthLoading = createSelector(
    selectAuthState,
    (state) => state.loading
);

// Sélecteur pour les erreurs
export const selectAuthError = createSelector(
    selectAuthState,
    (state) => state.error
);

// Sélecteur pour les rôles de l'utilisateur
export const selectUserRoles = createSelector(
    selectCurrentUser,
    (user) => user?.roles || []
);

// Sélecteur pour le nom d'utilisateur
export const selectUsername = createSelector(
    selectCurrentUser,
    (user) => user?.username || ''
);

// Sélecteur pour l'email de l'utilisateur
export const selectUserEmail = createSelector(
    selectCurrentUser,
    (user) => user?.email || ''
);

// Sélecteur pour l'ID de l'utilisateur
export const selectUserId = createSelector(
    selectCurrentUser,
    (user) => user?.id || null
);

// Sélecteur combiné pour vérifier si l'utilisateur a un rôle spécifique
export const selectHasRole = (role: string) => createSelector(
    selectUserRoles,
    (roles) => roles.includes(role as any)
);

// Sélecteur pour vérifier si l'utilisateur a au moins un des rôles spécifiés
export const selectHasAnyRole = (requiredRoles: string[]) => createSelector(
    selectUserRoles,
    (roles) => requiredRoles.some(role => roles.includes(role as any))
);
