describe('Navigation et Guards', () => {
    it('should redirect to login when accessing protected route', () => {
        cy.visit('/gestionnaire/dashboard');
        cy.url().should('include', '/auth/login');
    });

    it('should redirect to appropriate dashboard after login', () => {
        cy.visit('/auth/login');

        // Login en tant que client
        cy.get('input[type="text"]').type('client');
        cy.get('input[type="password"]').type('password');
        cy.get('button[type="submit"]').click();

        // Devrait rediriger vers le dashboard client
        cy.url().should('include', '/client');
    });

    it('should prevent access to unauthorized routes', () => {
        // Login en tant que client
        cy.visit('/auth/login');
        cy.get('input[type="text"]').type('client');
        cy.get('input[type="password"]').type('password');
        cy.get('button[type="submit"]').click();

        // Essayer d'accéder à une route gestionnaire
        cy.visit('/gestionnaire/dashboard');

        // Devrait être redirigé ou voir un message d'erreur
        cy.url().should('not.include', '/gestionnaire/dashboard');
    });

    it('should logout successfully', () => {
        // Login
        cy.visit('/auth/login');
        cy.get('input[type="text"]').type('testuser');
        cy.get('input[type="password"]').type('password');
        cy.get('button[type="submit"]').click();

        // Logout
        cy.contains(/déconnexion|logout|se déconnecter/i).click();

        // Vérifier la redirection vers login
        cy.url().should('include', '/auth/login');
    });
});

describe('Responsive Design', () => {
    const viewports = [
        { name: 'mobile', width: 375, height: 667 },
        { name: 'tablet', width: 768, height: 1024 },
        { name: 'desktop', width: 1920, height: 1080 }
    ];

    viewports.forEach(viewport => {
        it(`should display correctly on ${viewport.name}`, () => {
            cy.viewport(viewport.width, viewport.height);
            cy.visit('/');
            cy.get('body').should('be.visible');
        });
    });
});

describe('Error Handling', () => {
    it('should display 404 page for non-existent route', () => {
        cy.visit('/route-inexistante', { failOnStatusCode: false });
        cy.contains(/404|page.*trouvée|not found/i).should('be.visible');
    });

    it('should handle network errors gracefully', () => {
        // Simuler une erreur réseau en interceptant les requêtes
        cy.intercept('GET', '/api/**', { forceNetworkError: true });

        cy.visit('/auth/login');
        cy.get('input[type="text"]').type('testuser');
        cy.get('input[type="password"]').type('password');
        cy.get('button[type="submit"]').click();

        // Vérifier qu'un message d'erreur est affiché
        cy.contains(/erreur|error|connexion/i).should('be.visible');
    });
});
