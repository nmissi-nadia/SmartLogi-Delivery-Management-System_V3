describe('Gestionnaire - Dashboard et Gestion', () => {
    beforeEach(() => {
        // Login en tant que gestionnaire
        cy.visit('/auth/login');
        cy.get('input[type="text"]').type('gestionnaire');
        cy.get('input[type="password"]').type('password');
        cy.get('button[type="submit"]').click();

        cy.url().should('include', '/gestionnaire');
    });

    describe('Dashboard', () => {
        it('should display dashboard statistics', () => {
            cy.visit('/gestionnaire/dashboard');

            // Vérifier les statistiques principales
            cy.contains(/total.*colis|colis.*total/i).should('be.visible');
            cy.contains(/en cours|en transit/i).should('be.visible');
            cy.contains(/livrés|livraison/i).should('be.visible');
        });

        it('should display charts', () => {
            cy.visit('/gestionnaire/dashboard');

            // Vérifier la présence de graphiques
            cy.get('canvas, .chart, svg').should('exist');
        });

        it('should filter statistics by period', () => {
            cy.visit('/gestionnaire/dashboard');

            cy.get('select[name="periode"]').select('CETTE_SEMAINE');

            // Vérifier que les stats sont mises à jour
            cy.get('.stat-card, .statistics').should('be.visible');
        });
    });

    describe('Gestion des Colis', () => {
        it('should display all packages', () => {
            cy.visit('/gestionnaire/colis-list');

            cy.get('table, .colis-list').should('be.visible');
        });

        it('should assign package to deliverer', () => {
            cy.visit('/gestionnaire/colis-list');

            // Cliquer sur un colis
            cy.get('table tbody tr').first().click();

            // Assigner à un livreur
            cy.contains(/assigner|affecter/i).click();
            cy.get('select[name="livreurId"]').select(1);
            cy.get('button').contains(/confirmer|assigner/i).click();

            cy.contains(/assigné|affecté/i).should('be.visible');
        });

        it('should filter packages by status', () => {
            cy.visit('/gestionnaire/colis-list');

            cy.get('select[name="statut"]').select('EN_TRANSIT');

            cy.get('table tbody tr').should('have.length.greaterThan', 0);
        });

        it('should search packages', () => {
            cy.visit('/gestionnaire/colis-list');

            cy.get('input[type="search"], input[placeholder*="recherche"]').type('COL');

            cy.get('table tbody tr').should('be.visible');
        });
    });

    describe('Gestion des Utilisateurs', () => {
        it('should display users list', () => {
            cy.visit('/gestionnaire/users-management');

            cy.get('table, .users-list').should('be.visible');
        });

        it('should create new user', () => {
            cy.visit('/gestionnaire/users-management');

            cy.contains(/nouvel.*utilisateur|ajouter.*utilisateur/i).click();

            const timestamp = Date.now();
            cy.get('input[name="username"]').type(`user${timestamp}`);
            cy.get('input[name="email"]').type(`user${timestamp}@test.com`);
            cy.get('input[name="nom"]').type('Nouveau');
            cy.get('input[name="prenom"]').type('Utilisateur');
            cy.get('select[name="role"]').select('CLIENT_EXPEDITEUR');

            cy.get('button[type="submit"]').click();

            cy.contains(/créé|ajouté/i).should('be.visible');
        });

        it('should edit user', () => {
            cy.visit('/gestionnaire/users-management');

            cy.get('table tbody tr').first().find('button').contains(/modifier|edit/i).click();

            cy.get('input[name="nom"]').clear().type('Modifié');
            cy.get('button').contains(/enregistrer|sauvegarder/i).click();

            cy.contains(/modifié|mis à jour/i).should('be.visible');
        });

        it('should filter users by role', () => {
            cy.visit('/gestionnaire/users-management');

            cy.get('select[name="role"]').select('LIVREUR');

            cy.get('table tbody tr').should('be.visible');
        });
    });

    describe('Gestion des Zones', () => {
        it('should display zones list', () => {
            cy.visit('/gestionnaire/zones-management');

            cy.get('table, .zones-list').should('be.visible');
        });

        it('should create new zone', () => {
            cy.visit('/gestionnaire/zones-management');

            cy.contains(/nouvelle.*zone|ajouter.*zone/i).click();

            cy.get('input[name="nom"]').type('Zone Test');
            cy.get('input[name="codePostal"]').type('75001');

            cy.get('button[type="submit"]').click();

            cy.contains(/créée|ajoutée/i).should('be.visible');
        });
    });
});
