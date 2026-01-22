import { defineConfig } from 'cypress';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';

async function setupNodeEvents(
    on: Cypress.PluginEvents,
    config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions> {
    // This is required for the preprocessor to be able to generate JSON reports after each run
    await addCucumberPreprocessorPlugin(on, config);

    // Make sure to return the config object as it might have been modified by the plugin.
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
