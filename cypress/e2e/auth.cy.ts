describe('Authentication', () => {
    beforeEach(() => {
        cy.visit('/auth/login');
    });

    it('should display login form', () => {
        cy.get('input[type="text"]').should('be.visible');
        cy.get('input[type="password"]').should('be.visible');
        cy.get('button[type="submit"]').should('be.visible');
    });

    it('should show error with invalid credentials', () => {
        cy.get('input[type="text"]').type('invaliduser');
        cy.get('input[type="password"]').type('wrongpassword');
        cy.get('button[type="submit"]').click();

        // Vérifier qu'on reste sur la page de login ou qu'un message d'erreur s'affiche
        cy.url().should('include', '/auth/login');
    });

    it('should login successfully with valid credentials', () => {
        // Note: Adapter selon vos credentials de test
        cy.get('input[type="text"]').type('testuser');
        cy.get('input[type="password"]').type('password123');
        cy.get('button[type="submit"]').click();

        // Vérifier la redirection après login
        cy.url().should('not.include', '/auth/login');
    });

    it('should navigate to register page', () => {
        cy.contains(/s'inscrire|inscription|register/i).click();
        cy.url().should('include', '/auth/register');
    });

    it('should register new user', () => {
        cy.visit('/auth/register');

        const timestamp = Date.now();
        cy.get('input[name="username"]').type(`user${timestamp}`);
        cy.get('input[name="email"]').type(`user${timestamp}@test.com`);
        cy.get('input[name="password"]').type('Password123!');
        cy.get('input[name="nom"]').type('Test');
        cy.get('input[name="prenom"]').type('User');

        cy.get('button[type="submit"]').click();

        // Vérifier la redirection ou le message de succès
        cy.url().should('not.include', '/auth/register');
    });
});
