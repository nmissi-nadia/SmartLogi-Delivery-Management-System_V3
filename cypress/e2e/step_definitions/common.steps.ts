import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// ========== Steps Communs ==========

Given('que je suis sur la page de suivi rapide', () => {
    cy.visit('/destinataire/suivi-colis');
});

Given('que je suis connecté en tant que {string}', (role: string) => {
    // Mock de la connexion selon le rôle
    cy.visit('/auth/login');

    const credentials: Record<string, { username: string; password: string }> = {
        'gestionnaire': { username: 'gestionnaire', password: 'password' },
        'livreur': { username: 'livreur', password: 'password' },
        'client': { username: 'client', password: 'password' }
    };

    const cred = credentials[role.toLowerCase()];
    if (cred) {
        cy.get('input[type="text"]').first().type(cred.username);
        cy.get('input[type="password"]').type(cred.password);
        cy.get('button[type="submit"]').click();
    }
});

Given('que je suis sur la page {string}', (page: string) => {
    cy.visit(page);
});

// ========== Actions (When) ==========

When('je navigue vers la page {string}', (page: string) => {
    cy.visit(page);
});

When('je clique sur {string}', (text: string) => {
    cy.contains(text).click();
});

When('je saisis {string} dans {string}', (value: string, field: string) => {
    cy.contains(field).parent().find('input').type(value);
});

When('je saisis mon nom {string}', (nom: string) => {
    cy.get('input[name="nom"], input[placeholder*="nom"]').type(nom);
});

When('je saisis mon email {string}', (email: string) => {
    cy.get('input[type="email"], input[name="email"]').type(email);
});

When('je sélectionne {string}', (option: string) => {
    cy.contains(option).click();
});

// ========== Assertions (Then) ==========

Then('je devrais voir {string}', (text: string) => {
    cy.contains(text).should('be.visible');
});

Then('je devrais voir la liste de mes colis à livrer', () => {
    cy.get('[data-cy=colis-list], .colis-list, table').should('be.visible');
});

Then('je devrais voir les informations de mon colis', () => {
    cy.get('[data-cy=colis-details], .colis-details').should('be.visible');
});

Then('je devrais voir un message de confirmation', () => {
    cy.contains(/confirmation|succès|success/i).should('be.visible');
});

Then('je devrais voir un message {string}', (message: string) => {
    cy.contains(message).should('be.visible');
});

Then('le statut devrait être {string}', (statut: string) => {
    cy.contains(statut).should('be.visible');
});

// ========== Steps Spécifiques ==========

// Authentification
When('je saisis mes identifiants valides', () => {
    cy.get('input[type="text"]').first().type('testuser');
    cy.get('input[type="password"]').type('password');
});

When('je clique sur le bouton de connexion', () => {
    cy.get('button[type="submit"]').click();
});

// Colis
Given('que j\'ai des colis dans ma tournée', () => {
    // Mock data - à adapter selon votre implémentation
    cy.log('Colis mockés pour la tournée');
});

Given('que j\'ai un colis en cours de livraison', () => {
    cy.log('Colis en cours de livraison mocké');
});

Given('que j\'ai un colis à livrer', () => {
    cy.log('Colis à livrer mocké');
});

// Statistiques
Then('je devrais voir le nombre total de colis', () => {
    cy.get('[data-cy=total-colis], .stat-total').should('be.visible');
});

Then('je devrais voir le nombre de colis en cours', () => {
    cy.get('[data-cy=colis-en-cours], .stat-en-cours').should('be.visible');
});

Then('je devrais voir le nombre de colis livrés', () => {
    cy.get('[data-cy=colis-livres], .stat-livres').should('be.visible');
});

// Gestion utilisateurs
Given('qu\'il existe un utilisateur {string}', (email: string) => {
    cy.log(`Utilisateur ${email} mocké`);
});

Given('qu\'il existe un utilisateur actif', () => {
    cy.log('Utilisateur actif mocké');
});

Given('qu\'il existe un utilisateur désactivé', () => {
    cy.log('Utilisateur désactivé mocké');
});

// Helpers
When('je confirme', () => {
    cy.contains(/confirmer|ok|valider/i).click();
});

When('je confirme la {string}', (action: string) => {
    cy.contains(/confirmer|ok|valider/i).click();
});
