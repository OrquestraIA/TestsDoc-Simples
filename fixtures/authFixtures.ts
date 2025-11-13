import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DocumentsPage } from '../pages/DocumentsPage';

type MyFixtures = {
    loginPage: LoginPage;
    documentsPage: DocumentsPage;
    authenticatedPage: DocumentsPage;
};

export const test = base.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },

    documentsPage: async ({ page }, use) => {
        const documentsPage = new DocumentsPage(page);
        await use(documentsPage);
    },

    // Fixture que já faz login automaticamente
    authenticatedPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        const documentsPage = new DocumentsPage(page);

        // TODO: Implementar login automático
        // await loginPage.navigate();
        // await loginPage.login(process.env.TEST_USERNAME!, process.env.TEST_PASSWORD!);

        await use(documentsPage);

        // TODO: Implementar logout se necessário
    },
});

export { expect } from '@playwright/test';
