import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    readonly dashboardTitle: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator('input[name="username"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.loginButton = page.locator('button[type="submit"]');
        this.errorMessage = page.locator('.MuiAlert-message, [role="alert"]');
        this.dashboardTitle = page.locator('text=Bem-vindo ao Doc+Simples');
    }

    async navigate() {
        await this.page.goto('/', { 
            waitUntil: 'domcontentloaded',
            timeout: 60000 
        });
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async isLoggedIn(): Promise<boolean> {
        try {
            await this.dashboardTitle.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }

    async getErrorMessage(): Promise<string> {
        return await this.errorMessage.textContent() || '';
    }

    async isLoginFormVisible(): Promise<boolean> {
        return await this.usernameInput.isVisible();
    }
}