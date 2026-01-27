/**
 * Test utilities and helper functions
 */

/**
 * Creates a mock JWT token for testing
 */
export function createMockToken(payload: any = {}): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const defaultPayload = {
        sub: 'testuser',
        username: 'testuser',
        roles: ['CLIENT'],
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        ...payload,
    };
    const encodedPayload = btoa(JSON.stringify(defaultPayload));
    const signature = 'mock-signature';
    return `${header}.${encodedPayload}.${signature}`;
}

/**
 * Creates an expired mock JWT token
 */
export function createExpiredToken(): string {
    return createMockToken({
        exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
    });
}

/**
 * Waits for a specified amount of time
 */
export function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
