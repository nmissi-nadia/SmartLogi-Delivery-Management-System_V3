describe('Client - Gestion des Livraisons', () => {
    beforeEach(() => {
        // Login en tant que client
        cy.visit('/auth/login');
        cy.get('input[type="text"]').type('client');
        cy.get('input[type="password"]').type('password');
        cy.get('button[type="submit"]').click();

        // Attendre la redirection
        cy.url().should('include', '/client');
    });

    it('should display client dashboard', () => {
        cy.visit('/client/mes-colis');
        cy.get('body').should('contain', 'Mes Colis');
    });

    it('should create new delivery', () => {
        cy.visit('/client/nouvelle-livraison');

        // Remplir le formulaire
        cy.get('input[name="description"]').type('Colis de test');
        cy.get('input[name="poids"]').type('5');
        cy.get('select[name="priorite"]').select('HAUTE');

        // Informations destinataire
        cy.get('input[name="destinataireNom"]').type('Dupont');
        cy.get('input[name="destinatairePrenom"]').type('Jean');
        cy.get('input[name="destinataireEmail"]').type('jean.dupont@test.com');
        cy.get('input[name="destinataireTelephone"]').type('0612345678');

        // Adresse
        cy.get('input[name="adresseRue"]').type('123 Rue de Test');
        cy.get('input[name="adresseVille"]').type('Paris');
        cy.get('input[name="adresseCodePostal"]').type('75001');

        cy.get('button[type="submit"]').click();

        // Vérifier le succès
        cy.contains(/succès|créé|confirmation/i).should('be.visible');
    });

    it('should view delivery list', () => {
        cy.visit('/client/mes-colis');

        // Vérifier que la liste est affichée
        cy.get('table, .colis-list').should('be.visible');
    });

    it('should filter deliveries by status', () => {
        cy.visit('/client/mes-colis');

        // Sélectionner un filtre
        cy.get('select[name="statut"], .filter-statut').select('EN_TRANSIT');

        // Vérifier que la liste est mise à jour
        cy.get('table, .colis-list').should('be.visible');
    });

    it('should view delivery details', () => {
        cy.visit('/client/mes-colis');

        // Cliquer sur le premier colis (si disponible)
        cy.get('table tbody tr, .colis-item').first().click();

        // Vérifier les détails
        cy.contains(/détails|informations/i).should('be.visible');
    });
});
