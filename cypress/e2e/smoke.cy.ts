describe('SmartLogi - Smoke Test', () => {
    it('should load the application', () => {
        cy.visit('/');
        cy.get('body').should('be.visible');
    });

    it('should navigate to login page', () => {
        cy.visit('/auth/login');
        cy.url().should('include', '/auth/login');
    });
});
