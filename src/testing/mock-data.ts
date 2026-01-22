import { Role } from '../app/core/models';

/**
 * Mock data for testing
 */

export const mockUsers = {
    gestionnaire: {
        id: 1,
        username: 'gestionnaire',
        email: 'gestionnaire@test.com',
        roles: [Role.GESTIONNAIRE],
    },
    client: {
        id: 2,
        username: 'client',
        email: 'client@test.com',
        roles: [Role.CLIENT],
    },
    livreur: {
        id: 3,
        username: 'livreur',
        email: 'livreur@test.com',
        roles: [Role.LIVREUR],
    },
};

export const mockColis = [
    {
        id: 'COL-001',
        description: 'Colis test 1',
        poids: 5.5,
        hauteur: 20,
        largeur: 15,
        longueur: 30,
        statut: 'CREE' as const,
        dateCreation: new Date('2026-01-21T10:00:00'),
    },
    {
        id: 'COL-002',
        description: 'Colis test 2',
        poids: 3.2,
        hauteur: 15,
        largeur: 10,
        longueur: 20,
        statut: 'EN_TRANSIT' as const,
        dateCreation: new Date('2026-01-20T14:30:00'),
    },
    {
        id: 'COL-003',
        description: 'Colis test 3',
        poids: 2.0,
        hauteur: 10,
        largeur: 10,
        longueur: 15,
        statut: 'LIVRE' as const,
        dateCreation: new Date('2026-01-19T09:00:00'),
    },
];

export const mockLoginCredentials = {
    username: 'testuser',
    password: 'password123',
};

export const mockLoginResponse = {
    token: 'mock.jwt.token',
    user: mockUsers.client,
};
