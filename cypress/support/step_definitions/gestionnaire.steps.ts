import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Given steps
Given('je suis sur le tableau de bord', () => {
    cy.visit('/gestionnaire/dashboard');
});

Given('je suis sur la page de gestion des colis', () => {
    cy.visit('/gestionnaire/colis');
});

Given('il existe un colis non assigné', () => {
    cy.createColis({ statut: 'CREE', livreurId: null }).as('testColis');
});

Given('il existe un colis en cours', () => {
    cy.createColis({ statut: 'EN_TRANSIT' }).as('testColis');
});

Given('je suis sur la page de détails du colis', () => {
    cy.get('@testColis').then((colis: any) => {
        cy.visit(`/gestionnaire/colis/${colis.id}`);
    });
});

// When steps
When('je clique sur {string}', (buttonText: string) => {
    cy.contains('button', buttonText).click();
});

When('je remplis le formulaire de colis avec:', (dataTable) => {
    dataTable.hashes().forEach((row: any) => {
        const field = row.champ;
        const value = row.valeur;
        cy.get(`[data-cy="${field}"]`).type(value);
    });
});

When('je remplis les informations du destinataire', () => {
    cy.get('[data-cy="destinataire-nom"]').type('Test');
    cy.get('[data-cy="destinataire-prenom"]').type('User');
    cy.get('[data-cy="destinataire-email"]').type('test@example.com');
    cy.get('[data-cy="destinataire-telephone"]').type('0123456789');
    cy.get('[data-cy="destinataire-adresse"]').type('123 Test Street');
});

When('je sélectionne un livreur disponible', () => {
    cy.get('[data-cy="livreur-select"]').first().click();
});

When('je confirme l\'assignation', () => {
    cy.get('[data-cy="confirm-assign"]').click();
});

When('je change le statut à {string}', (statut: string) => {
    cy.get('[data-cy="statut-select"]').select(statut);
});

When('j\'ajoute un commentaire {string}', (commentaire: string) => {
    cy.get('[data-cy="commentaire"]').type(commentaire);
});

When('je confirme la modification', () => {
    cy.get('[data-cy="confirm-update"]').click();
});

When('je sélectionne le filtre {string}', (filtre: string) => {
    cy.get('[data-cy="statut-filter"]').select(filtre);
});

When('je saisis {string} dans la barre de recherche', (searchTerm: string) => {
    cy.get('[data-cy="search-input"]').type(searchTerm);
});

// Then steps
Then('je devrais voir les statistiques des colis', () => {
    cy.get('[data-cy="statistics"]').should('be.visible');
});

Then('je devrais voir le nombre total de colis', () => {
    cy.get('[data-cy="total-colis"]').should('exist');
});

Then('je devrais voir les colis par statut', () => {
    cy.get('[data-cy="colis-by-status"]').should('be.visible');
});

Then('le colis devrait être créé avec succès', () => {
    cy.get('[data-cy="success-message"]').should('contain', 'Colis créé');
});

Then('je devrais voir le nouveau colis dans la liste', () => {
    cy.get('[data-cy="colis-list"]').should('contain', 'Colis de test E2E');
});

Then('le livreur devrait être assigné au colis', () => {
    cy.get('[data-cy="assigned-livreur"]').should('exist');
});

Then('le statut du colis devrait être mis à jour', () => {
    cy.get('[data-cy="colis-status"]').should('not.contain', 'CREE');
});

Then('le statut devrait être mis à jour', () => {
    cy.get('[data-cy="colis-status"]').should('contain', 'EN_TRANSIT');
});

Then('l\'historique devrait contenir la modification', () => {
    cy.get('[data-cy="historique"]').should('contain', 'Colis en route');
});

Then('je devrais voir uniquement les colis en transit', () => {
    cy.get('[data-cy="colis-item"]').each(($el) => {
        cy.wrap($el).should('contain', 'EN_TRANSIT');
    });
});

Then('le compteur devrait afficher le bon nombre', () => {
    cy.get('[data-cy="filter-count"]').should('exist');
});

Then('je devrais voir uniquement le colis {string}', (colisId: string) => {
    cy.get('[data-cy="colis-item"]').should('have.length', 1);
    cy.get('[data-cy="colis-item"]').should('contain', colisId);
});
