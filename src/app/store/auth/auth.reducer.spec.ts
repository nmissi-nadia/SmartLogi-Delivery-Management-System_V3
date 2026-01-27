import { authReducer } from './auth.reducer';
import { initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';
import { User, Role } from '../../core/models';

/**
 * Tests unitaires pour authReducer
 */
describe('AuthReducer', () => {
    const mockUser: User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        roles: [Role.CLIENT]
    };

    it('should return the default state', () => {
        const action = { type: 'Unknown' } as any;
        const state = authReducer(initialAuthState, action);
        expect(state).toBe(initialAuthState);
    });

    it('should set loading to true on login action', () => {
        const action = AuthActions.login({ credentials: { username: 'test', password: 'password' } });
        const state = authReducer(initialAuthState, action);
        expect(state.loading).toBeTrue();
        expect(state.error).toBeNull();
    });

    it('should update state on loginSuccess action', () => {
        const action = AuthActions.loginSuccess({ user: mockUser, token: 'fake-token' });
        const state = authReducer(initialAuthState, action);
        expect(state.isAuthenticated).toBeTrue();
        expect(state.user).toEqual(mockUser);
        expect(state.token).toBe('fake-token');
        expect(state.loading).toBeFalse();
    });

    it('should set error on loginFailure action', () => {
        const action = AuthActions.loginFailure({ error: 'Auth failed' });
        const state = authReducer(initialAuthState, action);
        expect(state.error).toBe('Auth failed');
        expect(state.loading).toBeFalse();
    });

    it('should reset state on logoutSuccess action', () => {
        const loggedInState = {
            ...initialAuthState,
            isAuthenticated: true,
            user: mockUser,
            token: 'some-token'
        };
        const action = AuthActions.logoutSuccess();
        const state = authReducer(loggedInState, action);
        expect(state).toEqual(initialAuthState);
    });
});
