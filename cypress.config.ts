import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:4200',
        // Utiliser des tests Cypress classiques au lieu de Cucumber pour éviter les erreurs
        specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
        supportFile: 'cypress/support/e2e.ts',
        video: true,
        screenshotOnRunFailure: true,
        viewportWidth: 1280,
        viewportHeight: 720,
        defaultCommandTimeout: 10000,
        requestTimeout: 10000,
        responseTimeout: 10000,
    },
    env: {
        apiUrl: 'http://localhost:8084/api',
    },
});
