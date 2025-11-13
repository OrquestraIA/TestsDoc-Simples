import { test, expect } from '../fixtures/authFixtures';
import { TEST_DATA } from '../utils/constants';
import { PhysicalArchivePage } from '../pages/PhysicalArchivePage';

test.describe('Arquivo Físico', () => {
    let physicalArchivePage: PhysicalArchivePage;

    test.beforeEach(async ({ page }) => {
        physicalArchivePage = new PhysicalArchivePage(page);

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

        // Navegar para página de Arquivo Físico
        await physicalArchivePage.navigateToPhysicalArchive();
    });

    test('Validar abas exibidas no módulo Arquivo Físico', async ({ page }) => {
        // Verificar que estamos na página correta
        await expect(page).toHaveURL(/.*physical-archive/);

        // Verificar que o container de abas está visível
        await expect(physicalArchivePage.tabsContainer).toBeVisible();

        // Definir abas esperadas conforme requisito
        const expectedTabs = [
            'Visão Geral',
            'Localizações',
            'Repositórios',
            'Etiquetas',
            'Solicitações',
            'Temporalidade',
            'Transferências',
            'Documentos Físicos',
            'Candidatos à Vinculação',
            'Relatórios'
        ];

        // Verificar que todas as abas esperadas existem e estão visíveis
        for (const tabName of expectedTabs) {
            const tab = page.locator(`button[role="tab"]:has-text("${tabName}")`);
            await expect(tab).toBeVisible();
        }

        // Verificar que a aba "Visão Geral" está selecionada por padrão
        const isVisaoGeralSelected = await physicalArchivePage.isTabSelected('Visão Geral');
        expect(isVisaoGeralSelected).toBeTruthy();

        // Obter todas as abas visíveis
        const visibleTabs = await physicalArchivePage.getVisibleTabs();

        // Verificar que todas as abas esperadas estão presentes
        for (const expectedTab of expectedTabs) {
            expect(visibleTabs).toContain(expectedTab);
        }
    });

    test('Validar navegação entre abas do Arquivo Físico', async ({ page }) => {
        // Testar clique em cada aba principal
        const tabsToTest = [
            'Localizações',
            'Repositórios',
            'Etiquetas',
            'Solicitações',
            'Temporalidade',
            'Transferências',
            'Documentos Físicos',
            'Candidatos à Vinculação',
            'Relatórios',
            'Visão Geral'
        ];

        for (const tabName of tabsToTest) {
            await physicalArchivePage.clickTab(tabName);

            // Verificar que a aba foi selecionada
            const isSelected = await physicalArchivePage.isTabSelected(tabName);
            expect(isSelected).toBeTruthy();

            // Aguardar conteúdo carregar
            await page.waitForTimeout(500);
        }
    });

    test('Validar que todas as abas têm ícones corretos', async ({ page }) => {
        // Verificar ícone de cada aba
        const tabsWithIcons = [
            { name: 'Visão Geral', icon: 'AnalyticsIcon' },
            { name: 'Localizações', icon: 'LocationOnIcon' },
            { name: 'Repositórios', icon: 'StorageIcon' },
            { name: 'Etiquetas', icon: 'PrintIcon' },
            { name: 'Solicitações', icon: 'AssignmentIcon' },
            { name: 'Temporalidade', icon: 'ScheduleIcon' },
            { name: 'Transferências', icon: 'AssignmentIcon' },
            { name: 'Documentos Físicos', icon: 'QrCodeIcon' },
            { name: 'Candidatos à Vinculação', icon: 'FolderIcon' },
            { name: 'Relatórios', icon: 'GetAppIcon' }
        ];

        for (const tab of tabsWithIcons) {
            const tabElement = page.locator(`button[role="tab"]:has-text("${tab.name}")`);
            const icon = tabElement.locator(`[data-testid="${tab.icon}"]`);
            await expect(icon, `Aba "${tab.name}" deve ter ícone ${tab.icon}`).toBeVisible();
        }
    });

    test('Validar cards da aba Visão Geral', async ({ page }) => {
        // Garantir que estamos na aba Visão Geral
        await physicalArchivePage.clickTab('Visão Geral');
        await page.waitForTimeout(1000);

        // Definir cards esperados na ordem
        const expectedCards = [
            'Total de Localizações',
            'Documentos Arquivados',
            'Repositórios Ativos',
            'Solicitações Pendentes'
        ];

        // Verificar que todos os cards existem e estão visíveis
        for (const cardTitle of expectedCards) {
            const cardExists = await physicalArchivePage.verifyStatCardExists(cardTitle);
            expect(cardExists).toBeTruthy();
        }

        // Obter todos os cards e validar a ordem
        const statCards = await physicalArchivePage.getStatCards();

        // Verificar que temos pelo menos os 4 cards principais
        expect(statCards.length).toBeGreaterThanOrEqual(4);

        // Validar que os primeiros 4 cards estão na ordem correta
        expect(statCards[0].title).toBe('Total de Localizações');
        expect(statCards[1].title).toBe('Documentos Arquivados');
        expect(statCards[2].title).toBe('Repositórios Ativos');
        expect(statCards[3].title).toBe('Solicitações Pendentes');

        // Verificar que os valores são numéricos (podem ser 0)
        for (let i = 0; i < 4; i++) {
            const value = statCards[i].value;
            expect(value).toMatch(/^\d+$/); // Deve ser um número
        }
    });

    test('Validar card de Ocupação Média com suas seções e barras de progresso', async ({ page }) => {
        // Garantir que estamos na aba Visão Geral
        await physicalArchivePage.clickTab('Visão Geral');
        await page.waitForTimeout(1000);

        // Verificar que o card existe e está visível
        const occupationCard = await physicalArchivePage.getOccupationCard();
        await expect(occupationCard).toBeVisible();

        // Verificar o header do card
        const hasHeader = await physicalArchivePage.verifyOccupationCardHeader();
        expect(hasHeader).toBeTruthy();

        // Verificar as seções do card
        const sections = await physicalArchivePage.verifyOccupationCardSections();
        expect(sections.localizacoesExists).toBeTruthy();
        expect(sections.repositoriosExists).toBeTruthy();
        expect(sections.localizacoesHasProgressBar).toBeTruthy();
        expect(sections.repositoriosHasProgressBar).toBeTruthy();

        // Verificar atributos das barras de progresso
        const progressBarsValid = await physicalArchivePage.verifyProgressBarsAttributes();
        expect(progressBarsValid).toBeTruthy();

        // Verificar que as porcentagens estão no formato correto
        const percentages = await physicalArchivePage.getOccupationPercentages();
        expect(percentages.localizacoes).toMatch(/^\d+%$/);
        expect(percentages.repositorios).toMatch(/^\d+%$/);

        // Verificar elementos visuais específicos
        const cardContent = occupationCard.locator('.MuiCardContent-root');
        await expect(cardContent).toBeVisible();

        // Verificar que existem exatamente 2 barras de progresso
        const progressBars = occupationCard.locator('span.MuiLinearProgress-root[role="progressbar"]');
        await expect(progressBars).toHaveCount(2);

        // Verificar que cada barra tem os elementos internos corretos
        const progressBarInner = occupationCard.locator('span.MuiLinearProgress-bar.MuiLinearProgress-barColorSuccess.MuiLinearProgress-bar1Determinate');
        await expect(progressBarInner).toHaveCount(2);
    });

    test('Validar card de Status do Sistema com chips de funcionalidades', async ({ page }) => {
        // Garantir que estamos na aba Visão Geral
        await physicalArchivePage.clickTab('Visão Geral');
        await page.waitForTimeout(1000);

        // Verificar que o card "Status do Sistema" existe e está visível
        const systemStatusCard = await physicalArchivePage.getSystemStatusCard();
        await expect(systemStatusCard, 'Card "Status do Sistema" deve estar visível').toBeVisible();

        // Verificar o header do card com texto "Status do Sistema"
        const hasHeader = await physicalArchivePage.verifySystemStatusCardHeader();
        expect(hasHeader, 'Header <h6> com texto "Status do Sistema" deve estar visível').toBeTruthy();

        // Verificar a descrição "Sistema de arquivo físico operacional. Funcionalidades disponíveis:"
        const hasDescription = await physicalArchivePage.verifySystemStatusCardDescription();
        expect(hasDescription, 'Descrição <p> com texto sobre sistema operacional deve estar visível').toBeTruthy();

        // Verificar chips esperados com suas cores e ícones
        const expectedChips = [
            { label: 'Dashboard', icon: 'AnalyticsIcon', color: 'success' },
            { label: 'Localizações', icon: 'LocationOnIcon', color: 'primary' },
            { label: 'Repositórios', icon: 'StorageIcon', color: 'primary' },
            { label: 'Documentos', icon: 'QrCodeIcon', color: 'primary' },
            { label: 'Transferências', icon: 'AssignmentIcon', color: 'secondary' },
            { label: 'Relatórios', icon: 'GetAppIcon', color: 'secondary' }
        ];

        // Verificar que todos os chips existem e estão visíveis
        for (const chip of expectedChips) {
            const chipExists = await physicalArchivePage.verifySystemStatusChipExists(chip.label);
            expect(chipExists, `Chip "${chip.label}" deve estar visível no card`).toBeTruthy();
        }

        // Verificar que cada chip possui seu ícone correto
        for (const chip of expectedChips) {
            const hasIcon = await physicalArchivePage.verifySystemStatusChipIcon(chip.label, chip.icon);
            expect(hasIcon, `Chip "${chip.label}" deve ter ícone ${chip.icon}`).toBeTruthy();
        }

        // Verificar quantidade total de chips (deve ser exatamente 6)
        const chipCount = await physicalArchivePage.getSystemStatusChipCount();
        expect(chipCount, 'Card deve conter exatamente 6 chips de funcionalidades').toBe(6);

        // Obter detalhes de todos os chips (label, cor, presença de ícone)
        const chips = await physicalArchivePage.getSystemStatusChips();
        expect(chips.length, 'Deve retornar array com 6 chips').toBe(6);

        // Validar cores específicas de cada chip
        expect(chips.find(c => c.label === 'Dashboard')?.color, 'Chip "Dashboard" deve ter cor success (verde)').toBe('success');
        expect(chips.find(c => c.label === 'Localizações')?.color, 'Chip "Localizações" deve ter cor primary (azul)').toBe('primary');
        expect(chips.find(c => c.label === 'Repositórios')?.color, 'Chip "Repositórios" deve ter cor primary (azul)').toBe('primary');
        expect(chips.find(c => c.label === 'Documentos')?.color, 'Chip "Documentos" deve ter cor primary (azul)').toBe('primary');
        expect(chips.find(c => c.label === 'Transferências')?.color, 'Chip "Transferências" deve ter cor secondary (roxo)').toBe('secondary');
        expect(chips.find(c => c.label === 'Relatórios')?.color, 'Chip "Relatórios" deve ter cor secondary (roxo)').toBe('secondary');

        // Verificar que todos os chips têm ícones
        for (const chip of chips) {
            expect(chip.hasIcon, `Chip "${chip.label}" deve conter um ícone SVG`).toBeTruthy();
        }
    });

    test('Pesquisar documento físico por número de processo com filtros', async ({ page }) => {
        // Navegar para aba Documentos Físicos
        await physicalArchivePage.clickTab('Documentos Físicos');
        await page.waitForTimeout(1500);

        // Preencher campo de busca com número de processo "2058/2013"
        await physicalArchivePage.searchPhysicalDocument('2058/2013');

        // Selecionar tipo de documento "ProcessoMunicipal"
        await physicalArchivePage.selectDocumentType('ProcessoMunicipal');

        // Selecionar status de vínculo "Vinculados"
        await physicalArchivePage.selectLinkStatus('Vinculados');

        // Aguardar resultados da busca
        await page.waitForTimeout(2000);

        // Verificar que o card do documento 2058/2013 foi encontrado
        const cardExists = await physicalArchivePage.verifyPhysicalDocumentCardExists('2058/2013');
        expect(cardExists, 'Card do documento "2058/2013" deve estar visível nos resultados').toBeTruthy();

        // Obter resultados da busca
        const results = await physicalArchivePage.getPhysicalDocumentSearchResults();
        expect(results.length, 'Busca deve retornar pelo menos 1 resultado').toBeGreaterThanOrEqual(1);

        // Validar dados do primeiro resultado (2058/2013)
        const firstResult = results[0];
        expect(firstResult.processNumber, 'Número do processo deve ser "2058/2013"').toBe('2058/2013');
        expect(firstResult.linkStatus, 'Status do vínculo deve ser "Vinculado"').toBe('Vinculado');
        expect(firstResult.description, 'Descrição do documento deve conter "2058 2013"').toContain('2058 2013');
        expect(firstResult.digitalId, 'ID Digital deve estar presente e ser um UUID válido').toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
        expect(firstResult.documentType, 'Tipo do documento deve ser "ProcessoMunicipal"').toBe('ProcessoMunicipal');
        expect(firstResult.requester, 'Requerente deve estar presente').toBeTruthy();
        expect(firstResult.physicalAddress, 'Endereço físico deve seguir padrão (ex: R01.C01.P02.F05.CX10)').toMatch(/^R\d+\.C\d+\.P\d+\.F\d+\.CX\d+$/);
        expect(firstResult.archiveDate, 'Data de arquivamento deve estar no formato DD/MM/YYYY').toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
        expect(firstResult.temporalityStatus, 'Status de temporalidade deve estar presente').toBeTruthy();
    });

    test('Validar elementos visuais do card de documento físico', async ({ page }) => {
        // Navegar para aba Documentos Físicos
        await physicalArchivePage.clickTab('Documentos Físicos');
        await page.waitForTimeout(1500);

        // Buscar documento específico
        await physicalArchivePage.searchPhysicalDocument('2058/2013');
        await physicalArchivePage.selectDocumentType('ProcessoMunicipal');
        await physicalArchivePage.selectLinkStatus('Vinculados');
        await page.waitForTimeout(2000);

        // Obter detalhes dos elementos visuais do card
        const cardDetails = await physicalArchivePage.getPhysicalDocumentCardDetails('2058/2013');

        // Validar presença de todos os elementos visuais
        expect(cardDetails.hasQrCodeIcon, 'Card deve ter ícone QrCodeIcon no canto superior esquerdo').toBeTruthy();
        expect(cardDetails.hasLinkStatusChip, 'Card deve ter chip de status de vínculo (Vinculado/Não Vinculado)').toBeTruthy();
        expect(cardDetails.hasDigitalId, 'Card deve exibir ID Digital do documento').toBeTruthy();
        expect(cardDetails.hasDocumentType, 'Card deve exibir tipo do documento (ex: ProcessoMunicipal)').toBeTruthy();
        expect(cardDetails.hasRequester, 'Card deve exibir nome do requerente').toBeTruthy();
        expect(cardDetails.hasPhysicalAddress, 'Card deve exibir endereço físico de arquivamento').toBeTruthy();
        expect(cardDetails.hasArchiveDate, 'Card deve exibir data de arquivamento').toBeTruthy();
        expect(cardDetails.hasTemporalityChip, 'Card deve ter chip de status de temporalidade (corrente/intermediário/permanente)').toBeTruthy();
    });
});
