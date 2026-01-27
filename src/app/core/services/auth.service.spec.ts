import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { Role } from '../models';
import { mockLoginCredentials, mockLoginResponse, mockUsers } from '../../../testing/mock-data';
import { createMockToken, createExpiredToken } from '../../../testing/test-helpers';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;
    let tokenService: jasmine.SpyObj<TokenService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(() => {
        const tokenServiceSpy = jasmine.createSpyObj('TokenService', [
            'setToken',
            'getToken',
            'removeToken',
            'isTokenExpired',
            'getRolesFromToken',
            'getUsernameFromToken',
            'getTokenPayload',
        ]);

        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                AuthService,
                { provide: TokenService, useValue: tokenServiceSpy },
                { provide: Router, useValue: routerSpy },
            ],
        });

        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
        tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('login', () => {
        it('should authenticate user and store token', (done) => {
            const mockResponse = { token: 'mock.jwt.token' };
            tokenService.getRolesFromToken.and.returnValue(['CLIENT']);
            tokenService.getUsernameFromToken.and.returnValue('testuser');

            service.login(mockLoginCredentials).subscribe({
                next: (response) => {
                    expect(response.token).toBe('mock.jwt.token');
                    expect(tokenService.setToken).toHaveBeenCalledWith('mock.jwt.token');
                    done();
                },
                error: done.fail,
            });

            const req = httpMock.expectOne('http://localhost:8084/auth/login');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mockLoginCredentials);
            req.flush(mockResponse);
        });

        it('should update authentication state on successful login', (done) => {
            const mockResponse = { token: 'mock.jwt.token' };
            tokenService.getRolesFromToken.and.returnValue(['GESTIONNAIRE']);
            tokenService.getUsernameFromToken.and.returnValue('gestionnaire');

            service.login(mockLoginCredentials).subscribe({
                next: () => {
                    service.isAuthenticated$.subscribe((isAuth) => {
                        expect(isAuth).toBe(true);
                        done();
                    });
                },
                error: done.fail,
            });

            const req = httpMock.expectOne('http://localhost:8084/auth/login');
            req.flush(mockResponse);
        });

        it('should handle login error', (done) => {
            service.login(mockLoginCredentials).subscribe({
                next: () => done.fail('Should have failed'),
                error: (error) => {
                    expect(error.status).toBe(401);
                    done();
                },
            });

            const req = httpMock.expectOne('http://localhost:8084/auth/login');
            req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
        });
    });

    describe('register', () => {
        it('should register new client and store token', (done) => {
            const registerData = {
                username: 'newclient',
                email: 'new@test.com',
                password: 'password123',
                nom: 'Nouveau',
                prenom: 'Client',
            };

            const mockResponse = {
                token: 'new.jwt.token',
                user: mockUsers.client,
            };

            service.register(registerData).subscribe({
                next: (response) => {
                    expect(response.token).toBe('new.jwt.token');
                    expect(tokenService.setToken).toHaveBeenCalledWith('new.jwt.token');
                    done();
                },
                error: done.fail,
            });

            const req = httpMock.expectOne('http://localhost:8084/auth/register');
            expect(req.request.method).toBe('POST');
            req.flush(mockResponse);
        });
    });

    describe('logout', () => {
        it('should clear token and reset authentication state', () => {
            service.logout();

            expect(tokenService.removeToken).toHaveBeenCalled();
            expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
        });

        it('should update isAuthenticated$ to false', (done) => {
            service.logout();

            service.isAuthenticated$.subscribe((isAuth) => {
                expect(isAuth).toBe(false);
                done();
            });
        });
    });

    describe('isAuthenticated', () => {
        it('should return true when valid token exists', () => {
            tokenService.getToken.and.returnValue('valid.token');
            tokenService.isTokenExpired.and.returnValue(false);

            expect(service.isAuthenticated()).toBe(true);
        });

        it('should return false when no token exists', () => {
            tokenService.getToken.and.returnValue(null);

            expect(service.isAuthenticated()).toBe(false);
        });

        it('should logout and return false when token is expired', () => {
            tokenService.getToken.and.returnValue('expired.token');
            tokenService.isTokenExpired.and.returnValue(true);

            expect(service.isAuthenticated()).toBe(false);
            expect(tokenService.removeToken).toHaveBeenCalled();
        });
    });

    describe('hasRole', () => {
        it('should return true when user has the specified role', () => {
            tokenService.getRolesFromToken.and.returnValue(['GESTIONNAIRE', 'CLIENT']);

            expect(service.hasRole(Role.GESTIONNAIRE)).toBe(true);
        });

        it('should return false when user does not have the role', () => {
            tokenService.getRolesFromToken.and.returnValue(['CLIENT']);

            expect(service.hasRole(Role.GESTIONNAIRE)).toBe(false);
        });
    });

    describe('hasAnyRole', () => {
        it('should return true when user has at least one of the roles', () => {
            tokenService.getRolesFromToken.and.returnValue([Role.CLIENT]);

            expect(service.hasAnyRole([Role.GESTIONNAIRE, Role.CLIENT])).toBe(true);
        });

        it('should return false when user has none of the roles', () => {
            tokenService.getRolesFromToken.and.returnValue([Role.DESTINATAIRE]);

            expect(service.hasAnyRole([Role.GESTIONNAIRE, Role.CLIENT])).toBe(false);
        });
    });

    describe('getUserRoles', () => {
        it('should return user roles from token', () => {
            const roles = ['GESTIONNAIRE', 'CLIENT'];
            tokenService.getRolesFromToken.and.returnValue(roles);

            expect(service.getUserRoles()).toEqual(roles);
        });
    });

    describe('redirectByRole', () => {
        it('should redirect gestionnaire to dashboard', () => {
            tokenService.getRolesFromToken.and.returnValue(['GESTIONNAIRE']);

            service.redirectByRole();

            expect(router.navigate).toHaveBeenCalledWith(['/gestionnaire/dashboard']);
        });

        it('should redirect livreur to mes-colis', () => {
            tokenService.getRolesFromToken.and.returnValue(['LIVREUR']);

            service.redirectByRole();

            expect(router.navigate).toHaveBeenCalledWith(['/livreur/mes-colis']);
        });

        it('should redirect client to mes-colis', () => {
            tokenService.getRolesFromToken.and.returnValue([Role.CLIENT]);

            service.redirectByRole();

            expect(router.navigate).toHaveBeenCalledWith(['/client/mes-colis']);
        });

        it('should redirect destinataire to suivi-colis', () => {
            tokenService.getRolesFromToken.and.returnValue(['DESTINATAIRE']);

            service.redirectByRole();

            expect(router.navigate).toHaveBeenCalledWith(['/destinataire/suivi-colis']);
        });

        it('should redirect to home when no recognized role', () => {
            tokenService.getRolesFromToken.and.returnValue([]);

            service.redirectByRole();

            expect(router.navigate).toHaveBeenCalledWith(['/']);
        });
    });

    describe('getUserInfo', () => {
        it('should return user info from token', () => {
            const mockToken = createMockToken({
                sub: 'user123',
                username: 'testuser',
            });
            tokenService.getToken.and.returnValue(mockToken);
            tokenService.getTokenPayload.and.returnValue({
                sub: 'user123',
                username: 'testuser',
            });
            tokenService.getRolesFromToken.and.returnValue(['CLIENT']);

            const userInfo = service.getUserInfo();

            expect(userInfo).toBeTruthy();
            expect(userInfo?.username).toBe('testuser');
            expect(userInfo?.roles).toEqual(['CLIENT']);
        });

        it('should return null when no token exists', () => {
            tokenService.getToken.and.returnValue(null);

            const userInfo = service.getUserInfo();

            expect(userInfo).toBeNull();
        });
    });
});
