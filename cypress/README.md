# Tests E2E Cypress - SmartLogi

## 📋 État Actuel

### ✅ Configuration Cypress Fonctionnelle

Cypress est configuré avec des tests classiques (`.cy.ts`) pour éviter les problèmes de compatibilité avec le preprocessor Cucumber.

### ✅ Fichiers .feature créés (7 fichiers) - Documentation uniquement

Les scénarios Cucumber sont prêts dans `cypress/e2e/features/` :
- `livreur-tournee.feature` (5 scénarios)
- `destinataire-suivi.feature` (5 scénarios)
- `gestionnaire-users.feature` (8 scénarios)
- `gestionnaire-stats.feature` (8 scénarios)

### ⚠️ Step Definitions à créer

Les fichiers `.feature` nécessitent des step definitions pour être exécutés. Ils sont actuellement **désactivés** dans `cypress.config.ts`.

## 🚀 Pour activer les tests Cucumber

### 1. Créer les Step Definitions

Créez les fichiers dans `cypress/e2e/step_definitions/` :

```typescript
// cypress/e2e/step_definitions/common.steps.ts
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('que je suis connecté en tant que {string}', (role: string) => {
  // Implémentation de la connexion
  cy.visit('/auth/login');
  // ... logique de login
});

When('je navigue vers la page {string}', (page: string) => {
  cy.visit(page);
});

Then('je devrais voir {string}', (text: string) => {
  cy.contains(text).should('be.visible');
});

// Ajouter plus de steps selon les besoins
```

### 2. Réactiver la configuration Cucumber

Remplacez le contenu de `cypress.config.ts` par :

```typescript
import { defineConfig } from 'cypress';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';

async function setupNodeEvents(
    on: Cypress.PluginEvents,
    config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions> {
    await addCucumberPreprocessorPlugin(on, config);
    
    on(
        'file:preprocessor',
        createBundler({
            plugins: [createEsbuildPlugin(config)],
        })
    );
    
    return config;
}

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:4200',
        specPattern: 'cypress/e2e/**/*.feature',
        supportFile: 'cypress/support/e2e.ts',
        setupNodeEvents,
        video: true,
        screenshotOnRunFailure: true,
    },
    env: {
        apiUrl: 'http://localhost:8084/api',
    },
});
```

### 3. Exécuter les tests

```bash
# Mode interactif
npm run e2e:open

# Mode headless
npm run e2e
```

## 📝 Tests Cypress Classiques

En attendant, vous pouvez créer des tests Cypress classiques (sans Cucumber) :

```typescript
// cypress/e2e/login.cy.ts
describe('Login', () => {
  it('should login successfully', () => {
    cy.visit('/auth/login');
    cy.get('[data-cy=username]').type('testuser');
    cy.get('[data-cy=password]').type('password');
    cy.get('[data-cy=login-button]').click();
    cy.url().should('include', '/dashboard');
  });
});
```

## 🔗 Documentation

- [Cypress Documentation](https://docs.cypress.io/)
- [Cucumber Preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor)
