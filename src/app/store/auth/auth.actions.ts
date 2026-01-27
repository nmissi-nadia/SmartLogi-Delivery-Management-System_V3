import { createAction, props } from '@ngrx/store';
import { User, LoginCredentials, RegisterData } from '../../core/models';

/**
 * Actions pour la gestion de l'authentification
 */

// ========== Login ==========
export const login = createAction(
    '[Auth] Login',
    props<{ credentials: LoginCredentials }>()
);

export const loginSuccess = createAction(
    '[Auth] Login Success',
    props<{ user: User; token: string }>()
);

export const loginFailure = createAction(
    '[Auth] Login Failure',
    props<{ error: string }>()
);

// ========== Logout ==========
export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

// ========== Load User ==========
export const loadUser = createAction('[Auth] Load User');

export const loadUserSuccess = createAction(
    '[Auth] Load User Success',
    props<{ user: User }>()
);

export const loadUserFailure = createAction(
    '[Auth] Load User Failure',
    props<{ error: string }>()
);

// ========== Register ==========
export const register = createAction(
    '[Auth] Register',
    props<{ registerData: RegisterData }>()
);

export const registerSuccess = createAction(
    '[Auth] Register Success',
    props<{ user: User; token: string }>()
);

export const registerFailure = createAction(
    '[Auth] Register Failure',
    props<{ error: string }>()
);

// ========== Check Auth ==========
export const checkAuth = createAction('[Auth] Check Auth');

export const checkAuthSuccess = createAction(
    '[Auth] Check Auth Success',
    props<{ user: User; token: string }>()
);

export const checkAuthFailure = createAction('[Auth] Check Auth Failure');

// ========== Update User ==========
export const updateUser = createAction(
    '[Auth] Update User',
    props<{ user: User }>()
);

// ========== Clear Error ==========
export const clearError = createAction('[Auth] Clear Error');
