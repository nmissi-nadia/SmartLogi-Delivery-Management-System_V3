import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { AuthEffects } from './auth.effects';
import { AuthService } from '../../core/services/auth.service';
import { TokenService } from '../../core/services/token.service';
import { Router } from '@angular/router';
import * as AuthActions from './auth.actions';
import { Action } from '@ngrx/store';

/**
 * Tests unitaires pour AuthEffects
 */
describe('AuthEffects', () => {
    let actions$: Observable<Action>;
    let effects: AuthEffects;
    let authService: jasmine.SpyObj<AuthService>;
    let tokenService: jasmine.SpyObj<TokenService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(() => {
        const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'redirectByRole']);
        const tokenServiceSpy = jasmine.createSpyObj('TokenService', ['setToken', 'removeToken', 'getToken']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            providers: [
                AuthEffects,
                provideMockActions(() => actions$),
                { provide: AuthService, useValue: authServiceSpy },
                { provide: TokenService, useValue: tokenServiceSpy },
                { provide: Router, useValue: routerSpy }
            ]
        });

        effects = TestBed.inject(AuthEffects);
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });

    describe('login$', () => {
        it('should return loginSuccess on successful login', (done) => {
            const credentials = { username: 'test', password: 'password' };
            const response = { user: { id: 1, username: 'test', roles: [] } as any, token: 'fake-token' };

            authService.login.and.returnValue(of(response));
            actions$ = of(AuthActions.login({ credentials }));

            effects.login$.subscribe(action => {
                expect(action).toEqual(AuthActions.loginSuccess({ user: response.user, token: response.token }));
                done();
            });
        });

        it('should return loginFailure on login error', (done) => {
            const credentials = { username: 'test', password: 'password' };
            authService.login.and.returnValue(throwError(() => ({ message: 'Invalid credentials' })));
            actions$ = of(AuthActions.login({ credentials }));

            effects.login$.subscribe(action => {
                expect(action).toEqual(AuthActions.loginFailure({ error: 'Invalid credentials' }));
                done();
            });
        });
    });

    describe('loginSuccess$', () => {
        it('should store token and redirect', (done) => {
            const action = AuthActions.loginSuccess({ user: {} as any, token: 'token123' });
            actions$ = of(action);

            effects.loginSuccess$.subscribe(() => {
                expect(tokenService.setToken).toHaveBeenCalledWith('token123');
                expect(authService.redirectByRole).toHaveBeenCalled();
                done();
            });
        });
    });

    describe('logout$', () => {
        it('should remove token, navigate to login and return logoutSuccess', (done) => {
            actions$ = of(AuthActions.logout());

            effects.logout$.subscribe(action => {
                expect(tokenService.removeToken).toHaveBeenCalled();
                expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
                expect(action).toEqual(AuthActions.logoutSuccess());
                done();
            });
        });
    });
});
