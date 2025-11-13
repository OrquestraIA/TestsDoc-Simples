import { test, expect } from '../fixtures/authFixtures';
import { TEST_DATA } from '../utils/constants';

test.describe('Gerenciamento de Documentos', () => {
    test.beforeEach(async ({ page, documentsPage }) => {
        // Fazer login antes de cada teste
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const usernameInput = page.locator('input[name="username"]');
        const passwordInput = page.locator('input[name="password"]');
        const loginButton = page.locator('button[type="submit"]');

        await usernameInput.fill(TEST_DATA.VALID_USER.username);
        await passwordInput.fill(TEST_DATA.VALID_USER.password);
        await loginButton.click();

        await page.waitForURL('**/dashboard', { timeout: 10000 });

        // Navegar para página de documentos
        await documentsPage.navigateToDocuments();
    });

    // TODO: Implementar testes abaixo
    /*
    test('Upload de documento', async ({ authenticatedPage }) => {
        // TODO: Implementar teste de upload
    });

    test('Listagem de documentos', async ({ authenticatedPage }) => {
        // TODO: Implementar teste de listagem
    });
    */

    test('Busca de documentos', async ({ documentsPage, page }) => {
        // Verificar que estamos na página de documentos
        await expect(documentsPage.searchInput).toBeVisible();
        await expect(documentsPage.documentTypeSelect).toBeVisible();

        // Preencher campo de busca
        await documentsPage.searchDocument('2058 2013');

        // Selecionar tipo de documento
        await documentsPage.selectDocumentType('Processo Municipal');

        // Aguardar resultados
        await page.waitForTimeout(2000);

        // Verificar se o documento aparece nos resultados
        const documentExists = await documentsPage.verifyDocumentExists('2058 2013');
        expect(documentExists).toBeTruthy();

        // Verificar informações do documento
        if (documentExists) {
            const docInfo = await documentsPage.getDocumentInfo('2058 2013');

            expect(docInfo.title).toBe('2058 2013');
            expect(docInfo.type).toBe('ProcessoMunicipal');
            expect(docInfo.user).toBe('Administrator');
            expect(docInfo.size).toBe('497.52 KB');

            // Verificar que a data está no formato correto
            expect(docInfo.date).toMatch(/\d{2}\/\d{2}\/\d{4}/);
        }
    });

    test('Busca de documentos - Nenhum resultado encontrado', async ({ documentsPage, page }) => {
        // Verificar que estamos na página de documentos
        await expect(documentsPage.searchInput).toBeVisible();
        await expect(documentsPage.documentTypeSelect).toBeVisible();

        // Preencher campo de busca com número que não existe
        await documentsPage.searchDocument('9999 9999');

        // Selecionar tipo de documento
        await documentsPage.selectDocumentType('Processo Municipal');

        // Aguardar resultados
        await page.waitForTimeout(2000);

        // Verificar mensagem de nenhum documento encontrado
        const noResultsMessage = page.locator('h6.MuiTypography-h6:has-text("Nenhum documento encontrado")');
        await expect(noResultsMessage).toBeVisible();

        // Verificar que não há cards de documentos visíveis
        const documentExists = await documentsPage.verifyDocumentExists('9999 9999');
        expect(documentExists).toBeFalsy();
    });

    // TODO: Implementar testes abaixo
    /*
    test('Download de documento', async ({ authenticatedPage }) => {
        // TODO: Implementar teste de download
    });

    test('Exclusão de documento', async ({ authenticatedPage }) => {
        // TODO: Implementar teste de exclusão
    });

    test('Validação de tipos de arquivo permitidos', async ({ authenticatedPage }) => {
        // TODO: Implementar teste de validação de tipos
    });
    */
});
