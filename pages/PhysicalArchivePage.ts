import { Page, Locator, expect } from '@playwright/test';

export class PhysicalArchivePage {
    readonly page: Page;
    readonly tabsContainer: Locator;
    readonly visaoGeralTab: Locator;
    readonly localizacoesTab: Locator;
    readonly repositoriosTab: Locator;
    readonly etiquetasTab: Locator;
    readonly solicitacoesTab: Locator;
    readonly temporalidadeTab: Locator;
    readonly transferenciasTab: Locator;
    readonly documentosFisicosTab: Locator;
    readonly candidatosVinculacaoTab: Locator;
    readonly relatoriosTab: Locator;
    readonly arquivFisicoMenu: Locator;

    // Elementos da aba Documentos Físicos
    readonly searchPhysicalDocsInput: Locator;
    readonly documentTypeSelect: Locator;
    readonly linkStatusSelect: Locator;

    constructor(page: Page) {
        this.page = page;
        this.tabsContainer = page.locator('.MuiTabs-root');
        this.visaoGeralTab = page.locator('button[role="tab"]:has-text("Visão Geral")');
        this.localizacoesTab = page.locator('button[role="tab"]:has-text("Localizações")');
        this.repositoriosTab = page.locator('button[role="tab"]:has-text("Repositórios")');
        this.etiquetasTab = page.locator('button[role="tab"]:has-text("Etiquetas")');
        this.solicitacoesTab = page.locator('button[role="tab"]:has-text("Solicitações")');
        this.temporalidadeTab = page.locator('button[role="tab"]:has-text("Temporalidade")');
        this.transferenciasTab = page.locator('button[role="tab"]:has-text("Transferências")');
        this.documentosFisicosTab = page.locator('button[role="tab"]:has-text("Documentos Físicos")');
        this.candidatosVinculacaoTab = page.locator('button[role="tab"]:has-text("Candidatos à Vinculação")');
        this.relatoriosTab = page.locator('button[role="tab"]:has-text("Relatórios")');
        this.arquivFisicoMenu = page.locator('text=Arquivo Físico').first();

        // Elementos da aba Documentos Físicos
        this.searchPhysicalDocsInput = page.locator('input[placeholder*="Ex: 2228/2009"]');
        this.documentTypeSelect = page.locator('[role="combobox"]:has-text("ProcessoMunicipal")');
        this.linkStatusSelect = page.locator('[role="combobox"]:has-text("Vinculados")');
    }

    async navigateToPhysicalArchive() {
        // Verificar se é mobile e abrir drawer se necessário
        const drawerButton = this.page.locator('button[aria-label="open drawer"]');
        if (await drawerButton.isVisible()) {
            await drawerButton.click();
            await this.page.waitForTimeout(500); // Aguardar animação do drawer
        }

        await this.arquivFisicoMenu.click();
        await this.page.waitForURL('**/physical-archive');
        await this.page.waitForLoadState('networkidle');
    }

    async getAllTabs(): Promise<string[]> {
        const tabs = await this.tabsContainer.locator('button[role="tab"]').all();
        const tabNames: string[] = [];

        for (const tab of tabs) {
            const text = await tab.textContent();
            if (text) tabNames.push(text.trim());
        }

        return tabNames;
    }

    async getVisibleTabs(): Promise<string[]> {
        const visibleTabs: string[] = [];
        const tabs = [
            { name: 'Visão Geral', locator: this.visaoGeralTab },
            { name: 'Localizações', locator: this.localizacoesTab },
            { name: 'Repositórios', locator: this.repositoriosTab },
            { name: 'Etiquetas', locator: this.etiquetasTab },
            { name: 'Solicitações', locator: this.solicitacoesTab },
            { name: 'Temporalidade', locator: this.temporalidadeTab },
            { name: 'Transferências', locator: this.transferenciasTab },
            { name: 'Documentos Físicos', locator: this.documentosFisicosTab },
            { name: 'Candidatos à Vinculação', locator: this.candidatosVinculacaoTab },
            { name: 'Relatórios', locator: this.relatoriosTab }
        ];

        for (const tab of tabs) {
            if (await tab.locator.isVisible()) {
                visibleTabs.push(tab.name);
            }
        }

        return visibleTabs;
    }

    async clickTab(tabName: string) {
        const tab = this.page.locator(`button[role="tab"]:has-text("${tabName}")`);
        await tab.click();
        await this.page.waitForTimeout(1000);
    }

    async isTabSelected(tabName: string): Promise<boolean> {
        const tab = this.page.locator(`button[role="tab"]:has-text("${tabName}")`);
        const ariaSelected = await tab.getAttribute('aria-selected');
        return ariaSelected === 'true';
    }

    async verifyTabsExist(expectedTabs: string[]): Promise<boolean> {
        for (const tabName of expectedTabs) {
            const tab = this.page.locator(`button[role="tab"]:has-text("${tabName}")`);
            if (!await tab.isVisible()) {
                return false;
            }
        }
        return true;
    }

    // Métodos para validar cards da Visão Geral
    async getStatCards(): Promise<Array<{ title: string; value: string }>> {
        const cards: Array<{ title: string; value: string }> = [];

        // Pegar apenas cards que têm p.MuiTypography-body1 e h4.MuiTypography-h4
        const cardElements = await this.page.locator('.MuiCard-root:has(p.MuiTypography-body1):has(h4.MuiTypography-h4)').all();

        for (const card of cardElements) {
            const titleElement = card.locator('p.MuiTypography-body1');
            const valueElement = card.locator('h4.MuiTypography-h4');

            // Verificar se os elementos existem antes de tentar pegar o conteúdo
            if (await titleElement.count() > 0 && await valueElement.count() > 0) {
                const title = await titleElement.textContent();
                const value = await valueElement.textContent();

                if (title && value) {
                    cards.push({
                        title: title.trim(),
                        value: value.trim()
                    });
                }
            }
        }

        return cards;
    }

    async verifyStatCardExists(cardTitle: string): Promise<boolean> {
        const card = this.page.locator(`.MuiCard-root:has(p:has-text("${cardTitle}"))`);
        return await card.isVisible({ timeout: 5000 }).catch(() => false);
    }

    async getStatCardValue(cardTitle: string): Promise<string> {
        const card = this.page.locator(`.MuiCard-root:has(p:has-text("${cardTitle}"))`);
        const value = await card.locator('h4.MuiTypography-h4').textContent();
        return value?.trim() || '';
    }

    // Métodos para validar card de Ocupação Média
    async getOccupationCard(): Promise<Locator> {
        return this.page.locator('.MuiCard-root:has(h6:has-text("📊 Ocupação Média"))');
    }

    async verifyOccupationCardHeader(): Promise<boolean> {
        const card = await this.getOccupationCard();
        const header = card.locator('h6.MuiTypography-h6.MuiTypography-gutterBottom:has-text("📊 Ocupação Média")');
        return await header.isVisible();
    }

    async verifyOccupationCardSections(): Promise<{
        localizacoesExists: boolean;
        repositoriosExists: boolean;
        localizacoesHasProgressBar: boolean;
        repositoriosHasProgressBar: boolean;
    }> {
        const card = await this.getOccupationCard();

        // Verificar textos das seções
        const localizacoesText = card.locator('p.MuiTypography-body2:has-text("Localizações")');
        const repositoriosText = card.locator('p.MuiTypography-body2:has-text("Repositórios")');

        const localizacoesExists = await localizacoesText.isVisible();
        const repositoriosExists = await repositoriosText.isVisible();

        // Verificar barras de progresso
        const progressBars = card.locator('span.MuiLinearProgress-root[role="progressbar"]');
        const progressBarCount = await progressBars.count();

        return {
            localizacoesExists,
            repositoriosExists,
            localizacoesHasProgressBar: progressBarCount >= 1,
            repositoriosHasProgressBar: progressBarCount >= 2
        };
    }

    async getOccupationPercentages(): Promise<{
        localizacoes: string;
        repositorios: string;
    }> {
        const card = await this.getOccupationCard();

        // Pegar todos os h6 que contêm porcentagens
        const percentages = await card.locator('h6.MuiTypography-h6').allTextContents();

        // Filtrar apenas valores que terminam com %
        const percentageValues = percentages.filter(p => p.includes('%'));

        return {
            localizacoes: percentageValues[0] || '0%',
            repositorios: percentageValues[1] || '0%'
        };
    }

    async verifyProgressBarsAttributes(): Promise<boolean> {
        const card = await this.getOccupationCard();
        const progressBars = card.locator('span.MuiLinearProgress-root.MuiLinearProgress-colorSuccess.MuiLinearProgress-determinate');

        const count = await progressBars.count();
        if (count < 2) return false;

        // Verificar atributos das barras de progresso
        for (let i = 0; i < count; i++) {
            const bar = progressBars.nth(i);
            const role = await bar.getAttribute('role');
            const ariaValueMin = await bar.getAttribute('aria-valuemin');
            const ariaValueMax = await bar.getAttribute('aria-valuemax');

            if (role !== 'progressbar' || ariaValueMin !== '0' || ariaValueMax !== '100') {
                return false;
            }
        }

        return true;
    }

    // Métodos para validar card de Status do Sistema
    async getSystemStatusCard(): Promise<Locator> {
        return this.page.locator('.MuiCard-root:has(h6:has-text("Status do Sistema"))');
    }

    async verifySystemStatusCardHeader(): Promise<boolean> {
        const card = await this.getSystemStatusCard();
        const header = card.locator('h6.MuiTypography-h6.MuiTypography-gutterBottom:has-text("Status do Sistema")');
        return await header.isVisible();
    }

    async verifySystemStatusCardDescription(): Promise<boolean> {
        const card = await this.getSystemStatusCard();
        const description = card.locator('p.MuiTypography-root.MuiTypography-body2:has-text("Sistema de arquivo físico operacional")');
        return await description.isVisible();
    }

    async getSystemStatusChips(): Promise<Array<{ label: string; color: string; hasIcon: boolean }>> {
        const card = await this.getSystemStatusCard();
        const chips: Array<{ label: string; color: string; hasIcon: boolean }> = [];

        const chipElements = await card.locator('.MuiChip-root').all();

        for (const chip of chipElements) {
            const labelElement = chip.locator('.MuiChip-label');
            const label = await labelElement.textContent();

            // Detectar cor do chip
            const className = await chip.getAttribute('class');
            let color = 'default';
            if (className?.includes('MuiChip-colorSuccess')) {
                color = 'success';
            } else if (className?.includes('MuiChip-colorPrimary')) {
                color = 'primary';
            } else if (className?.includes('MuiChip-colorSecondary')) {
                color = 'secondary';
            }

            // Verificar se tem ícone
            const icon = chip.locator('.MuiChip-icon');
            const hasIcon = await icon.count() > 0;

            if (label) {
                chips.push({
                    label: label.trim(),
                    color,
                    hasIcon
                });
            }
        }

        return chips;
    }

    async verifySystemStatusChipExists(chipLabel: string): Promise<boolean> {
        const card = await this.getSystemStatusCard();
        const chip = card.locator(`.MuiChip-root:has(.MuiChip-label:has-text("${chipLabel}"))`);
        return await chip.isVisible();
    }

    async verifySystemStatusChipIcon(chipLabel: string, iconTestId: string): Promise<boolean> {
        const card = await this.getSystemStatusCard();
        const chip = card.locator(`.MuiChip-root:has(.MuiChip-label:has-text("${chipLabel}"))`);
        const icon = chip.locator(`[data-testid="${iconTestId}"]`);
        return await icon.isVisible();
    }

    async getSystemStatusChipCount(): Promise<number> {
        const card = await this.getSystemStatusCard();
        const chips = card.locator('.MuiChip-root');
        return await chips.count();
    }

    // Métodos para aba Documentos Físicos
    async searchPhysicalDocument(searchTerm: string) {
        await this.searchPhysicalDocsInput.fill(searchTerm);
        await this.page.waitForTimeout(1000); // Aguardar busca
    }

    async selectDocumentType(typeName: string) {
        // Localizar o select de tipo de documento (o primeiro combobox na página de Documentos Físicos)
        // que não seja o de Status Vínculo
        const typeSelect = this.page.locator('[role="combobox"]').first();
        await typeSelect.click();

        // Aguardar o dropdown abrir
        await this.page.waitForTimeout(500);

        // Selecionar a opção no dropdown
        const option = this.page.locator(`[role="option"]:has-text("${typeName}")`);
        await option.click();
        await this.page.waitForTimeout(500);
    }

    async selectLinkStatus(status: 'Vinculados' | 'Não Vinculados' | 'Todos') {
        // Localizar o select de Status Vínculo
        const statusSelect = this.page.locator('fieldset:has(legend:has-text("Status Vínculo"))').locator('..').locator('[role="combobox"]');
        await statusSelect.click();

        // Selecionar a opção
        const option = this.page.locator(`[role="option"]:has-text("${status}")`);
        await option.click();
        await this.page.waitForTimeout(500);
    }

    async getPhysicalDocumentSearchResults(): Promise<Array<{
        processNumber: string;
        linkStatus: string;
        description: string;
        digitalId: string;
        documentType: string;
        requester: string;
        physicalAddress: string;
        archiveDate: string;
        temporalityStatus: string;
    }>> {
        const results: Array<any> = [];

        // Pegar todos os cards de resultado
        const resultCards = await this.page.locator('.MuiCard-root:has(svg[data-testid="QrCodeIcon"])').all();

        for (const card of resultCards) {
            // Informações principais (lado esquerdo)
            const processNumber = await card.locator('h6.MuiTypography-h6').textContent() || '';
            const linkStatusChip = await card.locator('.MuiChip-root').first().textContent() || '';
            const description = await card.locator('p.MuiTypography-body1').textContent() || '';

            // Informações detalhadas
            const digitalIdText = await card.locator('p:has-text("ID Digital:")').textContent() || '';
            const digitalId = digitalIdText.replace('ID Digital:', '').trim();

            const typeText = await card.locator('p:has-text("Tipo:")').textContent() || '';
            const documentType = typeText.replace('Tipo:', '').trim();

            const requesterText = await card.locator('p:has-text("Requerente:")').textContent() || '';
            const requester = requesterText.replace('Requerente:', '').trim();

            // Localização física (lado direito)
            const addressText = await card.locator('p:has-text("Endereço:")').textContent() || '';
            const physicalAddress = addressText.replace('Endereço:', '').trim();

            const dateText = await card.locator('p:has-text("Data Arquivamento:")').textContent() || '';
            const archiveDate = dateText.replace('Data Arquivamento:', '').trim();

            const temporalityChip = await card.locator('.MuiChip-root').last().textContent() || '';

            results.push({
                processNumber: processNumber.trim(),
                linkStatus: linkStatusChip.trim(),
                description: description.trim(),
                digitalId,
                documentType,
                requester,
                physicalAddress,
                archiveDate,
                temporalityStatus: temporalityChip.trim()
            });
        }

        return results;
    }

    async verifyPhysicalDocumentCardExists(processNumber: string): Promise<boolean> {
        const card = this.page.locator(`.MuiCard-root:has(h6:has-text("${processNumber}"))`);
        return await card.isVisible({ timeout: 5000 }).catch(() => false);
    }

    async getPhysicalDocumentCardDetails(processNumber: string): Promise<{
        hasQrCodeIcon: boolean;
        hasLinkStatusChip: boolean;
        hasDigitalId: boolean;
        hasDocumentType: boolean;
        hasRequester: boolean;
        hasPhysicalAddress: boolean;
        hasArchiveDate: boolean;
        hasTemporalityChip: boolean;
    }> {
        const card = this.page.locator(`.MuiCard-root:has(h6:has-text("${processNumber}"))`);

        return {
            hasQrCodeIcon: await card.locator('svg[data-testid="QrCodeIcon"]').isVisible(),
            hasLinkStatusChip: await card.locator('.MuiChip-root').first().isVisible(),
            hasDigitalId: await card.locator('p:has-text("ID Digital:")').isVisible(),
            hasDocumentType: await card.locator('p:has-text("Tipo:")').isVisible(),
            hasRequester: await card.locator('p:has-text("Requerente:")').isVisible(),
            hasPhysicalAddress: await card.locator('p:has-text("Endereço:")').isVisible(),
            hasArchiveDate: await card.locator('p:has-text("Data Arquivamento:")').isVisible(),
            hasTemporalityChip: await card.locator('.MuiChip-root').last().isVisible()
        };
    }
}

