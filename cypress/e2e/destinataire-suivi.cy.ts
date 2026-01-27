describe('Destinataire - Suivi de Colis', () => {
    it('should access tracking page without login', () => {
        cy.visit('/destinataire/suivi-colis');
        cy.get('body').should('be.visible');
    });

    it('should track package with name and email', () => {
        cy.visit('/destinataire/suivi-colis');

        cy.get('input[name="nom"]').type('Dupont');
        cy.get('input[name="email"]').type('dupont@test.com');
        cy.get('button').contains(/suivre|rechercher/i).click();

        // Vérifier les résultats (ou message si aucun colis)
        cy.get('body').should('contain.text', /colis|aucun résultat/i);
    });

    it('should display package tracking history', () => {
        cy.visit('/destinataire/suivi-colis');

        cy.get('input[name="nom"]').type('Dupont');
        cy.get('input[name="email"]').type('dupont@test.com');
        cy.get('button').contains(/suivre/i).click();

        // Si un colis est trouvé, cliquer pour voir l'historique
        cy.get('.colis-item, table tbody tr').first().click();

        cy.contains(/historique|suivi/i).should('be.visible');
    });

    it('should show error for non-existent package', () => {
        cy.visit('/destinataire/suivi-colis');

        cy.get('input[name="nom"]').type('Inexistant');
        cy.get('input[name="email"]').type('inexistant@test.com');
        cy.get('button').contains(/suivre/i).click();

        cy.contains(/aucun.*colis|introuvable/i).should('be.visible');
    });

    it('should confirm package reception', () => {
        cy.visit('/destinataire/suivi-colis');

        cy.get('input[name="nom"]').type('Dupont');
        cy.get('input[name="email"]').type('dupont@test.com');
        cy.get('button').contains(/suivre/i).click();

        // Cliquer sur un colis livré
        cy.get('.colis-item').first().click();

        // Confirmer la réception
        cy.contains(/confirmer.*réception/i).click();
        cy.get('input[name="code"]').type('1234');
        cy.get('button').contains(/confirmer/i).click();

        cy.contains(/confirmé|reçu/i).should('be.visible');
    });
});
