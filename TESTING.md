# Guide de Tests - SmartLogi Angular

## Vue d'ensemble

Ce projet utilise une suite de tests complète comprenant :
- **Tests unitaires** avec Jasmine/Karma
- **Tests E2E** avec Cypress et Cucumber

## 📋 Table des matières

- [Installation](#installation)
- [Tests Unitaires](#tests-unitaires)
- [Tests E2E](#tests-e2e)
- [Structure des Tests](#structure-des-tests)
- [Bonnes Pratiques](#bonnes-pratiques)
- [CI/CD](#cicd)

## Installation

Les dépendances de test sont déjà configurées dans `package.json`. Pour installer :

```bash
npm install
```

## Tests Unitaires

### Exécution des tests

```bash
# Exécuter tous les tests unitaires
npm test

# Exécuter les tests avec couverture de code
npm run test:coverage

# Exécuter les tests en mode headless (pour CI)
npm run test:headless
```

### Tests implémentés

#### Services (3 services critiques)
- ✅ **AuthService** - Authentification et gestion des utilisateurs
- ✅ **TokenService** - Gestion des tokens JWT
- ✅ **ColisService** - CRUD des colis

#### Guards
- ✅ **authGuard** - Protection des routes authentifiées
- ✅ **roleGuard** - Protection des routes par rôle

#### NgRx Store
- ✅ **colis.selectors** - Sélecteurs pour l'état des colis

#### Composants
- ✅ **DashboardComponent** - Tableau de bord gestionnaire

### Structure d'un test unitaire

```typescript
describe('ServiceName', () => {
  let service: ServiceName;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServiceName],
    });
    service = TestBed.inject(ServiceName);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should do something', () => {
    // Arrange
    const expectedData = { ... };

    // Act
    service.method().subscribe(data => {
      // Assert
      expect(data).toEqual(expectedData);
    });

    const req = httpMock.expectOne('/api/endpoint');
    req.flush(expectedData);
  });
});
```

## Tests E2E

### Configuration

Les tests E2E utilisent Cypress avec Cucumber pour des scénarios BDD lisibles.

**Configuration Backend** : Par défaut, les tests pointent vers `http://localhost:8080/api`. Modifiez `cypress.config.ts` si nécessaire.

### Exécution des tests

```bash
# Ouvrir Cypress en mode interactif
npm run e2e:open

# Exécuter tous les tests E2E en mode headless
npm run e2e

# Exécuter tous les tests (unitaires + E2E)
npm run test:all
```

### Scénarios E2E implémentés

#### Authentification (`auth.feature`)
- Login réussi (gestionnaire, client, livreur)
- Login avec identifiants incorrects
- Logout et redirection
- Accès refusé sans authentification

#### Gestion des colis - Gestionnaire (`gestionnaire-colis.feature`)
- Consultation du dashboard
- Création d'un nouveau colis
- Assignation d'un livreur
- Modification du statut
- Filtrage et recherche

#### Livraisons - Client (`client-livraison.feature`)
- Création d'une nouvelle livraison
- Consultation de l'historique
- Suivi d'un colis

### Écrire un nouveau scénario Cucumber

**1. Créer le fichier `.feature`** dans `cypress/e2e/features/` :

```gherkin
Feature: Ma nouvelle fonctionnalité
  En tant qu'utilisateur
  Je veux faire quelque chose
  Afin d'obtenir un résultat

  Scenario: Mon scénario
    Given je suis sur la page X
    When je clique sur Y
    Then je devrais voir Z
```

**2. Implémenter les steps** dans `cypress/support/step_definitions/` :

```typescript
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('je suis sur la page X', () => {
  cy.visit('/page-x');
});

When('je clique sur Y', () => {
  cy.get('[data-cy="button-y"]').click();
});

Then('je devrais voir Z', () => {
  cy.get('[data-cy="element-z"]').should('be.visible');
});
```

### Commandes Cypress personnalisées

```typescript
// Login automatique
cy.login('GESTIONNAIRE');

// Créer un colis de test
cy.createColis({ description: 'Test', poids: 5 });

// Assigner un livreur
cy.assignLivreur('colis-id', 'livreur-id');
```

## Structure des Tests

```
src/
├── app/
│   ├── core/
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── auth.service.spec.ts          ✅ Tests unitaires
│   │   └── guards/
│   │       ├── auth.guard.ts
│   │       └── auth.guard.spec.ts            ✅ Tests unitaires
│   └── features/
│       └── gestionnaire/
│           └── dashboard/
│               ├── dashboard.component.ts
│               └── dashboard.component.spec.ts ✅ Tests unitaires
├── testing/
│   ├── test-helpers.ts                        🛠️ Utilitaires
│   └── mock-data.ts                           🛠️ Données mockées
└── test-setup.ts                              ⚙️ Configuration Jasmine

cypress/
├── e2e/
│   └── features/
│       ├── auth.feature                       🥒 Scénarios Cucumber
│       ├── gestionnaire-colis.feature
│       └── client-livraison.feature
├── support/
│   ├── commands.ts                            🛠️ Commandes custom
│   ├── e2e.ts                                 ⚙️ Configuration
│   └── step_definitions/
│       ├── auth.steps.ts                      📝 Implémentation steps
│       └── gestionnaire.steps.ts
└── fixtures/
    ├── users.json                             📊 Données de test
    └── colis.json

karma.conf.js                                  ⚙️ Config Karma
cypress.config.ts                              ⚙️ Config Cypress
```

## Bonnes Pratiques

### Tests Unitaires

1. **AAA Pattern** : Arrange, Act, Assert
2. **Isolation** : Chaque test doit être indépendant
3. **Mocking** : Mocker les dépendances externes (HTTP, services)
4. **Nommage** : Descriptions claires (`should do X when Y`)
5. **Couverture** : Viser 70%+ pour les fichiers critiques

### Tests E2E

1. **Data attributes** : Utiliser `data-cy` pour les sélecteurs
2. **Attentes explicites** : Toujours attendre les éléments
3. **Données de test** : Utiliser des fixtures
4. **Nettoyage** : Réinitialiser l'état entre les tests
5. **Scénarios réalistes** : Tester les parcours utilisateurs complets

### Sélecteurs recommandés

```html
<!-- ✅ Bon : data-cy -->
<button data-cy="submit-button">Soumettre</button>

<!-- ❌ Éviter : classes CSS -->
<button class="btn-primary">Soumettre</button>

<!-- ❌ Éviter : IDs générés -->
<button id="btn-123">Soumettre</button>
```

## Utilitaires de Test

### Mock Data (`src/testing/mock-data.ts`)

```typescript
import { mockUsers, mockColis, mockLoginResponse } from '../testing/mock-data';

// Utiliser dans les tests
const testUser = mockUsers.gestionnaire;
const testColis = mockColis[0];
```

### Test Helpers (`src/testing/test-helpers.ts`)

```typescript
import { createMockToken, createExpiredToken } from '../testing/test-helpers';

// Créer un token de test
const token = createMockToken({ roles: ['GESTIONNAIRE'] });
```

## CI/CD

### GitHub Actions (exemple)

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:headless
      - run: npm run e2e
```

### Rapports de Couverture

Après `npm run test:coverage`, consultez :
- **HTML** : `coverage/sdmsAngular/index.html`
- **Console** : Résumé affiché automatiquement

### Seuils de Couverture

Configurés dans `karma.conf.js` :
- Statements : 70%
- Branches : 70%
- Functions : 70%
- Lines : 70%

## Dépannage

### Problème : Tests Karma ne démarrent pas

```bash
# Vérifier que Chrome est installé
# Ou utiliser ChromeHeadless
npm run test:headless
```

### Problème : Cypress ne trouve pas les éléments

```typescript
// Augmenter le timeout
cy.get('[data-cy="element"]', { timeout: 10000 });

// Attendre explicitement
cy.wait(500);
```

### Problème : Tests E2E échouent (backend non disponible)

Vérifiez que le backend est démarré sur `http://localhost:8080`

```bash
# Dans le projet backend
./mvnw spring-boot:run
```

## Ressources

- [Jasmine Documentation](https://jasmine.github.io/)
- [Karma Documentation](https://karma-runner.github.io/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Cucumber Documentation](https://cucumber.io/docs/cucumber/)
- [Angular Testing Guide](https://angular.dev/guide/testing)

## Support

Pour toute question sur les tests, consultez :
1. Cette documentation
2. Les exemples de tests existants
3. La documentation officielle des outils

---

**Dernière mise à jour** : Janvier 2026
