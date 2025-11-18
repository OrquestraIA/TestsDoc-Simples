import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import { envManager } from './config/environment';

dotenv.config({ path: `.env.${process.env.ENVIRONMENT || 'dev'}` });

// Determina a URL base baseada no ambiente
const currentEnv = process.env.ENVIRONMENT || 'dev';
const baseURL = envManager.getBaseURL();

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: 0, // Sem retry para CI (mais rápido durante debug)
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        ['html', { outputFolder: `playwright-report-${currentEnv}`, open: 'never' }],
        ['list'],
        ['json', { outputFile: `test-results/results-${currentEnv}.json` }]
    ],

    use: {
        baseURL: baseURL,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        actionTimeout: 60000, // 60 segundos para cada ação
        navigationTimeout: 60000, // 60 segundos para navegação
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },

        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },

        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },

        // Mobile viewports - Desabilitado temporariamente
        // {
        //     name: 'Mobile Chrome',
        //     use: { ...devices['Pixel 5'] },
        // },
        // {
        //     name: 'Mobile Safari',
        //     use: { ...devices['iPhone 12'] },
        // },
    ],

    webServer: undefined,
});
