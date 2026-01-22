/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
        /**
         * Custom command to login with a specific role
         * @example cy.login('GESTIONNAIRE')
         */
        login(role: 'GESTIONNAIRE' | 'CLIENT' | 'LIVREUR' | 'DESTINATAIRE'): Chainable<void>;

        /**
         * Custom command to create a test colis
         * @example cy.createColis({ description: 'Test package' })
         */
        createColis(data: Partial<any>): Chainable<any>;

        /**
         * Custom command to assign a livreur to a colis
         * @example cy.assignLivreur('colis-id', 'livreur-id')
         */
        assignLivreur(colisId: string, livreurId: string): Chainable<void>;
    }
}

// Login command
Cypress.Commands.add('login', (role: string) => {
    const users = {
        GESTIONNAIRE: { username: 'gestionnaire', password: 'password123' },
        CLIENT: { username: 'client', password: 'password123' },
        LIVREUR: { username: 'livreur', password: 'password123' },
        DESTINATAIRE: { username: 'destinataire', password: 'password123' },
    };

    const user = users[role as keyof typeof users];

    cy.visit('/auth/login');
    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="password"]').type(user.password);
    cy.get('button[type="submit"]').click();

    // Wait for navigation
    cy.url().should('not.include', '/auth/login');
});

// Create colis command
Cypress.Commands.add('createColis', (data: Partial<any>) => {
    const defaultData = {
        description: 'Test package',
        poids: 5,
        hauteur: 10,
        largeur: 10,
        longueur: 10,
        ...data,
    };

    return cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/colis`,
        body: defaultData,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    }).then((response) => response.body);
});

// Assign livreur command
Cypress.Commands.add('assignLivreur', (colisId: string, livreurId: string) => {
    cy.request({
        method: 'PUT',
        url: `${Cypress.env('apiUrl')}/colis/${colisId}/assign/${livreurId}`,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
});
