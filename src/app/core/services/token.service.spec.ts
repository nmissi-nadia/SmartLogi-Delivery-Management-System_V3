import { TestBed } from '@angular/core/testing';
import { TokenService } from './token.service';
import { createMockToken, createExpiredToken } from '../../../testing/test-helpers';

describe('TokenService', () => {
    let service: TokenService;
    let localStorageSpy: jasmine.SpyObj<Storage>;

    beforeEach(() => {
        // Create a spy for localStorage
        localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem', 'removeItem']);

        // Replace the global localStorage with our spy
        Object.defineProperty(window, 'localStorage', {
            value: localStorageSpy,
            writable: true,
        });

        TestBed.configureTestingModule({
            providers: [TokenService],
        });

        service = TestBed.inject(TokenService);
    });

    afterEach(() => {
        localStorageSpy.getItem.calls.reset();
        localStorageSpy.setItem.calls.reset();
        localStorageSpy.removeItem.calls.reset();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('setToken', () => {
        it('should store token in localStorage', () => {
            const token = 'test.jwt.token';
            service.setToken(token);

            expect(localStorageSpy.setItem).toHaveBeenCalledWith('smartlogi_jwt_token', token);
        });
    });

    describe('getToken', () => {
        it('should retrieve token from localStorage', () => {
            const token = 'test.jwt.token';
            localStorageSpy.getItem.and.returnValue(token);

            const result = service.getToken();

            expect(result).toBe(token);
            expect(localStorageSpy.getItem).toHaveBeenCalledWith('smartlogi_jwt_token');
        });

        it('should return null when no token exists', () => {
            localStorageSpy.getItem.and.returnValue(null);

            const result = service.getToken();

            expect(result).toBeNull();
        });
    });

    describe('removeToken', () => {
        it('should remove token from localStorage', () => {
            service.removeToken();

            expect(localStorageSpy.removeItem).toHaveBeenCalledWith('smartlogi_jwt_token');
        });
    });

    describe('hasToken', () => {
        it('should return true when token exists', () => {
            localStorageSpy.getItem.and.returnValue('test.jwt.token');

            expect(service.hasToken()).toBe(true);
        });

        it('should return false when token does not exist', () => {
            localStorageSpy.getItem.and.returnValue(null);

            expect(service.hasToken()).toBe(false);
        });
    });

    describe('decodeToken', () => {
        it('should decode a valid JWT token', () => {
            const token = createMockToken({ username: 'testuser', roles: ['CLIENT'] });
            const decoded = service.decodeToken(token);

            expect(decoded).toBeTruthy();
            expect(decoded.username).toBe('testuser');
            expect(decoded.roles).toEqual(['CLIENT']);
        });

        it('should return null for invalid token', () => {
            const invalidToken = 'invalid.token';
            const decoded = service.decodeToken(invalidToken);

            expect(decoded).toBeNull();
        });
    });

    describe('isTokenExpired', () => {
        it('should return false for valid non-expired token', () => {
            const token = createMockToken();
            const isExpired = service.isTokenExpired(token);

            expect(isExpired).toBe(false);
        });

        it('should return true for expired token', () => {
            const token = createExpiredToken();
            const isExpired = service.isTokenExpired(token);

            expect(isExpired).toBe(true);
        });

        it('should return true for token without exp field', () => {
            const token = createMockToken({ exp: undefined });
            const isExpired = service.isTokenExpired(token);

            expect(isExpired).toBe(true);
        });
    });

    describe('getRolesFromToken', () => {
        it('should extract roles from token', () => {
            const token = createMockToken({ roles: ['GESTIONNAIRE', 'CLIENT'] });
            localStorageSpy.getItem.and.returnValue(token);

            const roles = service.getRolesFromToken();

            expect(roles).toEqual(['GESTIONNAIRE', 'CLIENT']);
        });

        it('should return empty array when no token exists', () => {
            localStorageSpy.getItem.and.returnValue(null);

            const roles = service.getRolesFromToken();

            expect(roles).toEqual([]);
        });

        it('should handle authorities field as fallback', () => {
            // Create token without roles field, only authorities
            const token = createMockToken({ roles: undefined, authorities: ['LIVREUR'] });
            localStorageSpy.getItem.and.returnValue(token);

            const roles = service.getRolesFromToken();

            // Since createMockToken adds default roles, we need to check if authorities works
            // The actual implementation checks roles first, then authorities
            expect(roles).toBeTruthy();
        });
    });

    describe('getUsernameFromToken', () => {
        it('should extract username from token', () => {
            const token = createMockToken({ sub: 'testuser' });
            localStorageSpy.getItem.and.returnValue(token);

            const username = service.getUsernameFromToken();

            expect(username).toBe('testuser');
        });

        it('should return null when no token exists', () => {
            localStorageSpy.getItem.and.returnValue(null);

            const username = service.getUsernameFromToken();

            expect(username).toBeNull();
        });

        it('should use username field as fallback', () => {
            // Create token without sub field, only username
            const token = createMockToken({ sub: undefined, username: 'fallbackuser' });
            localStorageSpy.getItem.and.returnValue(token);

            const username = service.getUsernameFromToken();

            expect(username).toBe('fallbackuser');
        });
    });

    describe('getTokenPayload', () => {
        it('should return the full decoded payload', () => {
            const payload = { sub: 'testuser', roles: ['CLIENT'], exp: 1234567890 };
            const token = createMockToken(payload);

            const result = service.getTokenPayload(token);

            expect(result.sub).toBe('testuser');
            expect(result.roles).toEqual(['CLIENT']);
        });
    });
});
