import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Background steps
Given('l\'application est lancée', () => {
    cy.visit('/');
});

Given('je suis sur la page de login', () => {
    cy.visit('/auth/login');
});

Given('je ne suis pas connecté', () => {
    cy.clearLocalStorage();
});

Given('je suis connecté en tant que {string}', (role: string) => {
    cy.login(role.toUpperCase() as any);
});

// When steps
When('je saisis {string} comme nom d\'utilisateur', (username: string) => {
    cy.get('input[name="username"]').clear().type(username);
});

When('je saisis {string} comme mot de passe', (password: string) => {
    cy.get('input[name="password"]').clear().type(password);
});

When('je clique sur le bouton de connexion', () => {
    cy.get('button[type="submit"]').click();
});

When('je clique sur le bouton de déconnexion', () => {
    cy.get('[data-cy="logout-button"]').click();
});

When('j\'essaie d\'accéder à {string}', (url: string) => {
    cy.visit(url);
});

// Then steps
Then('je devrais être redirigé vers {string}', (url: string) => {
    cy.url().should('include', url);
});

Then('je devrais voir le tableau de bord du gestionnaire', () => {
    cy.get('[data-cy="dashboard"]').should('be.visible');
});

Then('je devrais voir mes colis', () => {
    cy.get('[data-cy="colis-list"]').should('be.visible');
});

Then('je devrais voir un message d\'erreur {string}', (message: string) => {
    cy.get('[data-cy="error-message"]').should('contain', message);
});

Then('je devrais rester sur la page de login', () => {
    cy.url().should('include', '/auth/login');
});

Then('je ne devrais plus être authentifié', () => {
    cy.window().then((win) => {
        expect(win.localStorage.getItem('jwt_token')).to.be.null;
    });
});

Then('l\'URL de retour devrait être préservée', () => {
    cy.url().should('include', 'returnUrl');
});
