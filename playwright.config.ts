import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import { envManager } from './config/environment';

dotenv.config();

// Determina a URL base baseada no ambiente
const currentEnv = process.env.ENVIRONMENT || 'dev';
const baseURL = envManager.getBaseURL();

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        ['html', { outputFolder: `playwright-report-${currentEnv}` }],
        ['list'],
        ['json', { outputFile: `test-results/results-${currentEnv}.json` }]
    ],

    use: {
        baseURL: baseURL,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        actionTimeout: Number(process.env.ACTION_TIMEOUT) || 10000,
        navigationTimeout: Number(process.env.NAVIGATION_TIMEOUT) || 30000,
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
