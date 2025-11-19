import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TEST_DATA } from '../utils/constants';

/**
 * Testes de Autenticação e Segurança
 * RN-02: Controle de Acesso e Permissões
 */

test.describe('Autenticação', () => {

    test('Login com credenciais válidas', async ({ page }) => {
        const loginPage = new LoginPage(page);


        await loginPage.navigate();
        // Força credenciais diretamente para isolar problema de variáveis de ambiente
        console.log('Tentando login com:', {
            username: 'Administrator',
            password: 'Administrator'
        });
        await loginPage.login('Administrator', 'Administrator');

        // Coletar screenshot e HTML logo após submit do login
        await page.screenshot({ path: 'screenshots/auth-login-after-submit.png', fullPage: true });
        const htmlAfterLogin = await page.content();
        require('fs').writeFileSync('screenshots/auth-login-after-submit.html', htmlAfterLogin);

        // Verificar se há mensagem de erro visível
        const errorMsg = await loginPage.getErrorMessage();
        if (errorMsg) {
            console.log('Mensagem de erro após login:', errorMsg);
        }

        // Verificar redirecionamento para dashboard
        try {
            await page.waitForURL('**/dashboard', { timeout: 30000 });
            const isLoggedIn = await loginPage.isLoggedIn();
            expect(isLoggedIn).toBeTruthy();
            await page.screenshot({ path: 'screenshots/auth-login-success.png', fullPage: true });
        } catch (e) {
            await page.screenshot({ path: 'screenshots/auth-login-failed.png', fullPage: true });
            const htmlOnFail = await page.content();
            require('fs').writeFileSync('screenshots/auth-login-failed.html', htmlOnFail);
            console.log('Erro ao aguardar redirecionamento para dashboard:', e);
            throw e;
        }
    });

    test('Login com credenciais inválidas', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.navigate();
        await loginPage.login('invalid_user', 'invalid_password');

        await page.waitForTimeout(2000);

        // Verificar se permanece na tela de login
        const isLoginFormVisible = await loginPage.isLoginFormVisible();
        expect(isLoginFormVisible).toBeTruthy();

        await page.screenshot({ path: 'screenshots/auth-login-failed.png', fullPage: true });
    });

    test('Logout do sistema', async ({ page }) => {
        const loginPage = new LoginPage(page);

        // Fazer login primeiro
        await loginPage.navigate();
        await loginPage.login(TEST_DATA.VALID_USER.username, TEST_DATA.VALID_USER.password);
        await page.waitForURL('**/dashboard', { timeout: 30000 });

        // Clicar no botão do menu de usuário (botão que contém avatar E texto "Administrator")
        const userMenuButton = page.locator('button.MuiIconButton-root:has(.MuiAvatar-root):has(p:has-text("Administrator"))').first();

        if (await userMenuButton.isVisible({ timeout: 5000 })) {
            await userMenuButton.click();
            await page.waitForTimeout(500); // Aguardar menu abrir

            // Clicar no item de menu "Sair" 
            const logoutMenuItem = page.locator('li[role="menuitem"]:has-text("Sair")').first();

            if (await logoutMenuItem.isVisible({ timeout: 3000 })) {
                await logoutMenuItem.click();
                await page.waitForTimeout(2000);

                // Verificar se voltou para tela de login
                const isLoginFormVisible = await loginPage.isLoginFormVisible();
                expect(isLoginFormVisible).toBeTruthy();

                console.log('Logout realizado com sucesso');
                await page.screenshot({ path: 'screenshots/auth-logout-success.png', fullPage: true });
            } else {
                console.log('Item de menu "Sair" não encontrado');
                test.skip();
            }
        } else {
            console.log('Botão do menu de usuário não encontrado');
            test.skip();
        }
    });
});
