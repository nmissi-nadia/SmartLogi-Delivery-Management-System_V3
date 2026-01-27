import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { jwtInterceptor } from './jwt.interceptor';
import { TokenService } from '../services/token.service';

describe('jwtInterceptor', () => {
    let tokenService: jasmine.SpyObj<TokenService>;
    let mockRequest: HttpRequest<any>;
    let mockNext: HttpHandlerFn;

    beforeEach(() => {
        // Create spy for TokenService
        const tokenServiceSpy = jasmine.createSpyObj('TokenService', ['getToken', 'isTokenExpired']);

        TestBed.configureTestingModule({
            providers: [
                { provide: TokenService, useValue: tokenServiceSpy }
            ]
        });

        tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;

        // Mock HttpRequest
        mockRequest = new HttpRequest('GET', '/api/colis');

        // Mock HttpHandlerFn
        mockNext = jasmine.createSpy('next').and.returnValue(of({} as HttpEvent<any>));
    });

    it('should add Authorization header when token is valid', () => {
        // Arrange
        const mockToken = 'valid-jwt-token';
        tokenService.getToken.and.returnValue(mockToken);
        tokenService.isTokenExpired.and.returnValue(false);

        // Act
        TestBed.runInInjectionContext(() => {
            jwtInterceptor(mockRequest, mockNext);
        });

        // Assert
        expect(mockNext).toHaveBeenCalled();
        const modifiedRequest = (mockNext as jasmine.Spy).calls.mostRecent().args[0] as HttpRequest<any>;
        expect(modifiedRequest.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    });

    it('should NOT add Authorization header when token is null', () => {
        // Arrange
        tokenService.getToken.and.returnValue(null);

        // Act
        TestBed.runInInjectionContext(() => {
            jwtInterceptor(mockRequest, mockNext);
        });

        // Assert
        expect(mockNext).toHaveBeenCalled();
        const modifiedRequest = (mockNext as jasmine.Spy).calls.mostRecent().args[0] as HttpRequest<any>;
        expect(modifiedRequest.headers.has('Authorization')).toBeFalse();
    });

    it('should NOT add Authorization header when token is expired', () => {
        // Arrange
        const expiredToken = 'expired-jwt-token';
        tokenService.getToken.and.returnValue(expiredToken);
        tokenService.isTokenExpired.and.returnValue(true);

        // Act
        TestBed.runInInjectionContext(() => {
            jwtInterceptor(mockRequest, mockNext);
        });

        // Assert
        expect(mockNext).toHaveBeenCalled();
        const modifiedRequest = (mockNext as jasmine.Spy).calls.mostRecent().args[0] as HttpRequest<any>;
        expect(modifiedRequest.headers.has('Authorization')).toBeFalse();
    });

    it('should NOT add Authorization header for login route', () => {
        // Arrange
        const loginRequest = new HttpRequest('POST', '/api/auth/login', {});
        const mockToken = 'valid-jwt-token';
        tokenService.getToken.and.returnValue(mockToken);
        tokenService.isTokenExpired.and.returnValue(false);

        // Act
        TestBed.runInInjectionContext(() => {
            jwtInterceptor(loginRequest, mockNext);
        });

        // Assert
        expect(mockNext).toHaveBeenCalled();
        const modifiedRequest = (mockNext as jasmine.Spy).calls.mostRecent().args[0] as HttpRequest<any>;
        expect(modifiedRequest.headers.has('Authorization')).toBeFalse();
    });

    it('should pass request unchanged when no token is available', () => {
        // Arrange
        tokenService.getToken.and.returnValue(null);

        // Act
        TestBed.runInInjectionContext(() => {
            jwtInterceptor(mockRequest, mockNext);
        });

        // Assert
        expect(mockNext).toHaveBeenCalledWith(mockRequest);
    });
});
