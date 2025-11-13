import { Page, Locator, expect } from '@playwright/test';

export class DocumentsPage {
    readonly page: Page;
    readonly uploadButton: Locator;
    readonly fileInput: Locator;
    readonly documentsList: Locator;
    readonly searchInput: Locator;
    readonly documentTypeSelect: Locator;
    readonly logoutButton: Locator;
    readonly userAvatar: Locator;
    readonly documentosMenu: Locator;
    readonly documentCards: Locator;

    constructor(page: Page) {
        this.page = page;
        this.uploadButton = page.locator('button:has-text("Upload")');
        this.fileInput = page.locator('input[type="file"]');
        this.documentsList = page.locator('.MuiCardContent-root');
        this.searchInput = page.locator('input[placeholder="Pesquisar documentos..."]');
        this.documentTypeSelect = page.locator('[role="combobox"]');
        this.logoutButton = page.locator('[data-testid="logout"], button:has-text("Sair")');
        this.userAvatar = page.locator('text=Administrator');
        this.documentosMenu = page.locator('text=Documentos').first();
        this.documentCards = page.locator('.MuiCardContent-root');
    }

    async navigateToDocuments() {
        await this.documentosMenu.click();
        await this.page.waitForLoadState('networkidle');
    }

    async uploadDocument(filePath: string) {
        // TODO: Implementar upload de documento
    }

    async searchDocument(query: string) {
        await this.searchInput.fill(query);
        // Aguardar a busca processar
        await this.page.waitForTimeout(1000);
    }

    async selectDocumentType(type: string) {
        await this.documentTypeSelect.click();
        await this.page.waitForTimeout(500);

        // Selecionar a opção do dropdown
        const option = this.page.locator(`li[role="option"]:has-text("${type}")`);
        await option.click();
        await this.page.waitForTimeout(1000);
    }

    async deleteDocument(documentName: string) {
        // TODO: Implementar exclusão de documento
    }

    async downloadDocument(documentName: string) {
        // TODO: Implementar download de documento
    }

    async getDocumentsList(): Promise<string[]> {
        const cards = await this.documentCards.all();
        const titles: string[] = [];

        for (const card of cards) {
            const title = await card.locator('h6.MuiTypography-subtitle1').textContent();
            if (title) titles.push(title.trim());
        }

        return titles;
    }

    async getDocumentByTitle(title: string): Promise<Locator> {
        return this.page.locator(`.MuiCardContent-root:has(h6:has-text("${title}"))`);
    }

    async verifyDocumentExists(title: string): Promise<boolean> {
        const doc = await this.getDocumentByTitle(title);
        return await doc.isVisible({ timeout: 5000 }).catch(() => false);
    }

    async getDocumentInfo(title: string) {
        const docCard = await this.getDocumentByTitle(title);

        const type = await docCard.locator('span.MuiTypography-caption').first().textContent();
        const date = await docCard.locator('[data-testid="CalendarTodayIcon"] + span').textContent();
        const user = await docCard.locator('[data-testid="PersonIcon"] + span').textContent();
        const size = await docCard.locator('[data-testid="StorageIcon"] + span').textContent();

        return {
            title: title,
            type: type?.trim() || '',
            date: date?.trim() || '',
            user: user?.trim() || '',
            size: size?.trim() || ''
        };
    }
}
