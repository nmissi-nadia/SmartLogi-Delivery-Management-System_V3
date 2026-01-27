describe('Livreur - Gestion de Tournée', () => {
    beforeEach(() => {
        // Login en tant que livreur
        cy.visit('/auth/login');
        cy.get('input[type="text"]').type('livreur');
        cy.get('input[type="password"]').type('password');
        cy.get('button[type="submit"]').click();

        cy.url().should('include', '/livreur');
    });

    it('should display delivery list', () => {
        cy.visit('/livreur/mes-colis');
        cy.get('body').should('contain', 'Mes Colis');
    });

    it('should view assigned deliveries', () => {
        cy.visit('/livreur/mes-colis');

        // Vérifier que la liste des colis est affichée
        cy.get('table, .colis-list').should('be.visible');
    });

    it('should update delivery status to "En cours de livraison"', () => {
        cy.visit('/livreur/mes-colis');

        // Cliquer sur un colis
        cy.get('table tbody tr, .colis-item').first().click();

        // Changer le statut
        cy.get('select[name="statut"], .statut-select').select('EN_COURS_DE_LIVRAISON');
        cy.get('button').contains(/enregistrer|sauvegarder|valider/i).click();

        // Vérifier le succès
        cy.contains(/succès|mis à jour/i).should('be.visible');
    });

    it('should mark delivery as delivered', () => {
        cy.visit('/livreur/mes-colis');

        // Cliquer sur un colis en cours
        cy.get('table tbody tr, .colis-item').first().click();

        // Marquer comme livré
        cy.get('select[name="statut"]').select('LIVRE');

        // Ajouter une signature ou commentaire
        cy.get('textarea[name="commentaire"]').type('Livré au destinataire');

        cy.get('button').contains(/confirmer|livrer/i).click();

        // Vérifier le succès
        cy.contains(/livré|succès/i).should('be.visible');
    });

    it('should report delivery problem', () => {
        cy.visit('/livreur/mes-colis');

        cy.get('table tbody tr, .colis-item').first().click();

        // Signaler un problème
        cy.contains(/problème|signaler/i).click();

        cy.get('select[name="typeProbleme"]').select('DESTINATAIRE_ABSENT');
        cy.get('textarea[name="commentaire"]').type('Personne au domicile');

        cy.get('button[type="submit"]').click();

        cy.contains(/enregistré|signalé/i).should('be.visible');
    });

    it('should view delivery route', () => {
        cy.visit('/livreur/ma-tournee');

        // Vérifier que la carte ou l'itinéraire est affiché
        cy.get('.map, #map, canvas').should('be.visible');
    });
});
