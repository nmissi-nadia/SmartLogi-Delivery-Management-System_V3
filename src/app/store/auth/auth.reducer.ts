import { createReducer, on } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

/**
 * Reducer pour la gestion de l'état d'authentification
 */
export const authReducer = createReducer(
    initialAuthState,

    // ========== Login ==========
    on(AuthActions.login, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(AuthActions.loginSuccess, (state, { user, token }) => ({
        ...state,
        user,
        token,
        isAuthenticated: true,
        loading: false,
        error: null
    })),

    on(AuthActions.loginFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
        isAuthenticated: false
    })),

    // ========== Logout ==========
    on(AuthActions.logout, (state) => ({
        ...state,
        loading: true
    })),

    on(AuthActions.logoutSuccess, () => initialAuthState),

    // ========== Load User ==========
    on(AuthActions.loadUser, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(AuthActions.loadUserSuccess, (state, { user }) => ({
        ...state,
        user,
        loading: false,
        error: null
    })),

    on(AuthActions.loadUserFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // ========== Register ==========
    on(AuthActions.register, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(AuthActions.registerSuccess, (state, { user, token }) => ({
        ...state,
        user,
        token,
        isAuthenticated: true,
        loading: false,
        error: null
    })),

    on(AuthActions.registerFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
        isAuthenticated: false
    })),

    // ========== Check Auth ==========
    on(AuthActions.checkAuth, (state) => ({
        ...state,
        loading: true
    })),

    on(AuthActions.checkAuthSuccess, (state, { user, token }) => ({
        ...state,
        user,
        token,
        isAuthenticated: true,
        loading: false,
        error: null
    })),

    on(AuthActions.checkAuthFailure, (state) => ({
        ...state,
        isAuthenticated: false,
        loading: false
    })),

    // ========== Update User ==========
    on(AuthActions.updateUser, (state, { user }) => ({
        ...state,
        user
    })),

    // ========== Clear Error ==========
    on(AuthActions.clearError, (state) => ({
        ...state,
        error: null
    }))
);
