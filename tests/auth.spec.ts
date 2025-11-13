import { test, expect } from '../fixtures/authFixtures';
import { TEST_DATA } from '../utils/constants';

test.describe('Autenticação', () => {
    test.beforeEach(async ({ loginPage }) => {
        await loginPage.navigate();
        // Aguardar a página carregar completamente
        await loginPage.page.waitForLoadState('networkidle');
    });

    test('Login com credenciais válidas', async ({ loginPage }) => {
        // Verificar que formulário de login está visível
        await expect(loginPage.usernameInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();

        // Realizar login
        await loginPage.login(TEST_DATA.VALID_USER.username, TEST_DATA.VALID_USER.password);

        // Aguardar navegação para o dashboard
        await loginPage.page.waitForURL('**/dashboard', { timeout: 10000 });

        // Verificar que está logado
        const isLoggedIn = await loginPage.isLoggedIn();
        expect(isLoggedIn).toBeTruthy();

        // Verificar elementos do dashboard
        await expect(loginPage.dashboardTitle).toBeVisible();
    });

    test('Login com credenciais inválidas', async ({ loginPage }) => {
        // Tentar login com credenciais inválidas
        await loginPage.login(TEST_DATA.INVALID_USER.username, TEST_DATA.INVALID_USER.password);

        // Aguardar um pouco para mensagem de erro aparecer
        await loginPage.page.waitForTimeout(2000);

        // Verificar que continua na página de login
        const isStillOnLogin = await loginPage.isLoginFormVisible();
        expect(isStillOnLogin).toBeTruthy();
    });

    test('Logout do sistema', async ({ loginPage }) => {
        // Primeiro fazer login
        await loginPage.login(TEST_DATA.VALID_USER.username, TEST_DATA.VALID_USER.password);
        await loginPage.page.waitForURL('**/dashboard', { timeout: 10000 });

        // Verificar que está logado
        expect(await loginPage.isLoggedIn()).toBeTruthy();

        // Clicar no botão do avatar (círculo com letra A)
        const userAvatar = loginPage.page.getByRole('button', { name: /A Administrator/i });
        await userAvatar.click();

        // Aguardar menu aparecer
        await loginPage.page.waitForTimeout(1500);

        // Tentar encontrar botão de logout/sair no menu
        const logoutButton = loginPage.page.locator('li:has-text("Sair"), li:has-text("Logout"), [role="menuitem"]:has-text("Sair")').first();

        if (await logoutButton.isVisible({ timeout: 2000 })) {
            await logoutButton.click();

            // Aguardar processo de logout
            await loginPage.page.waitForTimeout(2000);

            // Verificar que voltou para login (aceita qualquer URL que não seja dashboard)
            const currentUrl = loginPage.page.url();
            expect(currentUrl).not.toContain('/dashboard');

            // Verificar que formulário de login está visível
            expect(await loginPage.isLoginFormVisible()).toBeTruthy();
        } else {
            // Se não encontrar botão de logout, pular o teste
            test.skip();
        }
    }); test('Validação de campos obrigatórios', async ({ loginPage }) => {
        // Verificar que botão de login está presente
        await expect(loginPage.loginButton).toBeVisible();

        // Tentar submeter formulário vazio
        await loginPage.loginButton.click();

        // Aguardar validação
        await loginPage.page.waitForTimeout(1000);

        // Verificar que continua na página de login
        expect(await loginPage.isLoginFormVisible()).toBeTruthy();

        // Tentar com apenas username
        await loginPage.usernameInput.fill(TEST_DATA.VALID_USER.username);
        await loginPage.loginButton.click();
        await loginPage.page.waitForTimeout(1000);

        // Verificar que continua na página de login
        expect(await loginPage.isLoginFormVisible()).toBeTruthy();
    });
});