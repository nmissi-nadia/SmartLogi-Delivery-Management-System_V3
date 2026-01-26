import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, of } from 'rxjs';
import { errorInterceptor } from './error.interceptor';
import { AuthService } from '../services/auth.service';

describe('errorInterceptor', () => {
    let router: jasmine.SpyObj<Router>;
    let authService: jasmine.SpyObj<AuthService>;
    let mockRequest: HttpRequest<any>;
    let mockNext: HttpHandlerFn;

    beforeEach(() => {
        // Create spies
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);

        TestBed.configureTestingModule({
            providers: [
                { provide: Router, useValue: routerSpy },
                { provide: AuthService, useValue: authServiceSpy }
            ]
        });

        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

        mockRequest = new HttpRequest('GET', '/api/colis');
    });

    it('should handle 401 error and logout user', (done) => {
        // Arrange
        const error401 = new HttpErrorResponse({
            error: 'Unauthorized',
            status: 401,
            statusText: 'Unauthorized'
        });

        mockNext = jasmine.createSpy('next').and.returnValue(throwError(() => error401));

        // Act
        TestBed.runInInjectionContext(() => {
            const result$ = errorInterceptor(mockRequest, mockNext);

            result$.subscribe({
                error: (error) => {
                    // Assert
                    expect(authService.logout).toHaveBeenCalled();
                    expect(error.status).toBe(401);
                    expect(error.message).toContain('Session expirée');
                    done();
                }
            });
        });
    });

    it('should handle 403 error and navigate to access-denied', (done) => {
        // Arrange
        const error403 = new HttpErrorResponse({
            error: 'Forbidden',
            status: 403,
            statusText: 'Forbidden'
        });

        mockNext = jasmine.createSpy('next').and.returnValue(throwError(() => error403));

        // Act
        TestBed.runInInjectionContext(() => {
            const result$ = errorInterceptor(mockRequest, mockNext);

            result$.subscribe({
                error: (error) => {
                    // Assert
                    expect(router.navigate).toHaveBeenCalledWith(['/access-denied']);
                    expect(error.status).toBe(403);
                    expect(error.message).toContain('Accès refusé');
                    done();
                }
            });
        });
    });

    it('should handle 404 error', (done) => {
        // Arrange
        const error404 = new HttpErrorResponse({
            error: 'Not Found',
            status: 404,
            statusText: 'Not Found'
        });

        mockNext = jasmine.createSpy('next').and.returnValue(throwError(() => error404));

        // Act
        TestBed.runInInjectionContext(() => {
            const result$ = errorInterceptor(mockRequest, mockNext);

            result$.subscribe({
                error: (error) => {
                    // Assert
                    expect(error.status).toBe(404);
                    expect(error.message).toContain('Ressource non trouvée');
                    done();
                }
            });
        });
    });

    it('should handle 500 error', (done) => {
        // Arrange
        const error500 = new HttpErrorResponse({
            error: 'Internal Server Error',
            status: 500,
            statusText: 'Internal Server Error'
        });

        mockNext = jasmine.createSpy('next').and.returnValue(throwError(() => error500));

        // Act
        TestBed.runInInjectionContext(() => {
            const result$ = errorInterceptor(mockRequest, mockNext);

            result$.subscribe({
                error: (error) => {
                    // Assert
                    expect(error.status).toBe(500);
                    expect(error.message).toContain('Erreur serveur');
                    done();
                }
            });
        });
    });

    it('should handle network error (status 0)', (done) => {
        // Arrange
        const networkError = new HttpErrorResponse({
            error: 'Network error',
            status: 0,
            statusText: 'Unknown Error'
        });

        mockNext = jasmine.createSpy('next').and.returnValue(throwError(() => networkError));

        // Act
        TestBed.runInInjectionContext(() => {
            const result$ = errorInterceptor(mockRequest, mockNext);

            result$.subscribe({
                error: (error) => {
                    // Assert
                    expect(error.status).toBe(0);
                    expect(error.message).toContain('Impossible de se connecter au serveur');
                    done();
                }
            });
        });
    });

    it('should handle client-side error', (done) => {
        // Arrange
        const clientError = new HttpErrorResponse({
            error: new ErrorEvent('Network error', {
                message: 'Connection failed'
            }),
            status: 0,
            statusText: 'Unknown Error'
        });

        mockNext = jasmine.createSpy('next').and.returnValue(throwError(() => clientError));

        // Act
        TestBed.runInInjectionContext(() => {
            const result$ = errorInterceptor(mockRequest, mockNext);

            result$.subscribe({
                error: (error) => {
                    // Assert
                    expect(error.message).toContain('Connection failed');
                    done();
                }
            });
        });
    });

    it('should pass successful responses unchanged', (done) => {
        // Arrange
        const successResponse = { data: 'success' };
        mockNext = jasmine.createSpy('next').and.returnValue(of(successResponse as any));

        // Act
        TestBed.runInInjectionContext(() => {
            const result$ = errorInterceptor(mockRequest, mockNext);

            result$.subscribe({
                next: (response) => {
                    // Assert
                    expect(response).toEqual(successResponse as any);
                    expect(authService.logout).not.toHaveBeenCalled();
                    expect(router.navigate).not.toHaveBeenCalled();
                    done();
                }
            });
        });
    });
});
