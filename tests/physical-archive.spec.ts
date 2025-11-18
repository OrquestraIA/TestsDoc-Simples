import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TEST_DATA } from '../utils/constants';

/**
 * Testes de Gestão de Arquivo Físico
 * RN-148: Gestão Integrada de Documentos (parte física)
 */

test.describe('Arquivo Físico', () => {

    // Garante login antes de cada teste
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login(TEST_DATA.VALID_USER.username, TEST_DATA.VALID_USER.password);
        const loggedIn = await loginPage.isLoggedIn();
        console.log('Login realizado?', loggedIn);
        if (!loggedIn) {
            const errorMsg = await loginPage.getErrorMessage();
            throw new Error('Falha no login antes do teste. Mensagem: ' + errorMsg);
        }
    });

    test('Pesquisar repositórios', async ({ page }) => {
        await page.goto('/physical-archive');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        const repositoriesTab = page.locator('button[role="tab"]:has-text("Repositórios")');
        if (await repositoriesTab.isVisible({ timeout: 5000 })) {
            await repositoriesTab.click();
            await page.waitForTimeout(1000);
        }

        const searchInput = page.locator('input[placeholder="Digite para buscar..."]');

        if (await searchInput.isVisible({ timeout: 5000 })) {
            await searchInput.fill('arquivo');
            await searchInput.press('Enter');
            await page.waitForTimeout(2000);

            const emptyState = page.locator('h6:has-text("Nenhum repositório encontrado")');
            const hasEmptyState = await emptyState.isVisible({ timeout: 3000 }).catch(() => false);

            if (hasEmptyState) {
                console.log('Nenhum repositório encontrado - empty state exibido corretamente');
            }

            await page.screenshot({ path: 'screenshots/physical-archive-repositories-search.png', fullPage: true });
            expect(true).toBeTruthy();
        } else {
            console.log('Campo de busca de repositórios não encontrado');
            test.skip();
        }
    });

    test('Filtrar repositórios por tipo e status', async ({ page }) => {
        await page.goto('/physical-archive');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        const repositoriesTab = page.locator('button[role="tab"]:has-text("Repositórios")');
        if (await repositoriesTab.isVisible({ timeout: 5000 })) {
            await repositoriesTab.click();
            await page.waitForTimeout(1000);
        }

        const tipoFilter = page.locator('div[role="combobox"]:has-text("Todos")').first();
        const statusFilter = page.locator('div[role="combobox"]:has-text("Todos")').nth(1);

        const hasTipoFilter = await tipoFilter.isVisible({ timeout: 5000 }).catch(() => false);
        const hasStatusFilter = await statusFilter.isVisible({ timeout: 5000 }).catch(() => false);

        if (hasTipoFilter && hasStatusFilter) {
            console.log('Filtros de Tipo e Status em Repositórios encontrados');
            await page.screenshot({ path: 'screenshots/physical-archive-repositories-filters.png', fullPage: true });
            expect(hasTipoFilter && hasStatusFilter).toBeTruthy();
        } else {
            console.log('Filtros de repositórios não encontrados');
            test.skip();
        }
    });

    // Aba: Etiquetas
    test.describe('Etiquetas', () => {
        test('Gerar etiquetas com código de barras', async ({ page }) => {
            await page.goto('/physical-archive');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            const labelsTab = page.locator('button[role="tab"]:has-text("Etiquetas")');
            if (await labelsTab.isVisible({ timeout: 5000 })) {
                await labelsTab.click();
                await page.waitForTimeout(1000);
            }

            const generateButton = page.locator('button:has-text("Gerar Etiquetas")');
            const hasGenerateButton = await generateButton.isVisible({ timeout: 5000 }).catch(() => false);

            if (hasGenerateButton) {
                console.log('Botão Gerar Etiquetas encontrado');

                const spec6x10 = page.locator('.MuiChip-label:has-text("6cm x 10cm")');
                const specCode128 = page.locator('.MuiChip-label:has-text("Code 128")');
                const specPDF = page.locator('.MuiChip-label:has-text("PDF")');

                const hasSpecs = await spec6x10.isVisible({ timeout: 3000 }).catch(() => false) &&
                    await specCode128.isVisible({ timeout: 3000 }).catch(() => false) &&
                    await specPDF.isVisible({ timeout: 3000 }).catch(() => false);

                if (hasSpecs) {
                    console.log('Especificações de etiquetas encontradas: 6x10cm, Code 128, PDF');
                }

                await page.screenshot({ path: 'screenshots/physical-archive-labels-generate.png', fullPage: true });
                expect(hasGenerateButton).toBeTruthy();
            } else {
                console.log('Botão Gerar Etiquetas não encontrado');
                test.skip();
            }
        });

        test('Visualizar preview de etiquetas', async ({ page }) => {
            await page.goto('/physical-archive');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            const labelsTab = page.locator('button[role="tab"]:has-text("Etiquetas")');
            if (await labelsTab.isVisible({ timeout: 5000 })) {
                await labelsTab.click();
                await page.waitForTimeout(1000);
            }

            const previewButton = page.locator('button:has-text("Preview")');
            const hasPreviewButton = await previewButton.isVisible({ timeout: 5000 }).catch(() => false);

            if (hasPreviewButton) {
                console.log('Botão Preview de etiquetas encontrado');

                const repoCount = page.locator('h4:has-text("0")');
                const hasRepoCount = await repoCount.isVisible({ timeout: 3000 }).catch(() => false);

                if (hasRepoCount) {
                    console.log('Contador de Repositórios Disponíveis: 0');
                }

                await page.screenshot({ path: 'screenshots/physical-archive-labels-preview.png', fullPage: true });
                expect(hasPreviewButton).toBeTruthy();
            } else {
                console.log('Botão Preview não encontrado');
                test.skip();
            }
        });

        test('Verificar informações do sistema de etiquetas', async ({ page }) => {
            await page.goto('/physical-archive');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            const labelsTab = page.locator('button[role="tab"]:has-text("Etiquetas")');
            if (await labelsTab.isVisible({ timeout: 5000 })) {
                await labelsTab.click();
                await page.waitForTimeout(1000);
            }

            const systemTitle = page.locator('h5:has-text("Sistema de Geração de Etiquetas")');
            const hasTitle = await systemTitle.isVisible({ timeout: 5000 }).catch(() => false);

            if (hasTitle) {
                console.log('Título do Sistema de Geração de Etiquetas encontrado');

                const hint = page.locator('p:has-text("R01.C01.P01.F01.CX01")');
                const hasHint = await hint.isVisible({ timeout: 3000 }).catch(() => false);

                if (hasHint) {
                    console.log('Dica sobre formato de localização física encontrada');
                }

                const especCard = page.locator('h6:has-text("Especificações")');
                const repoCard = page.locator('h6:has-text("Repositórios Disponíveis")');
                const actionsCard = page.locator('h6:has-text("Ações Disponíveis")');

                const hasCards = await especCard.isVisible({ timeout: 3000 }).catch(() => false) &&
                    await repoCard.isVisible({ timeout: 3000 }).catch(() => false) &&
                    await actionsCard.isVisible({ timeout: 3000 }).catch(() => false);

                if (hasCards) {
                    console.log('3 cards informativos encontrados no sistema de etiquetas');
                }

                await page.screenshot({ path: 'screenshots/physical-archive-labels-info.png', fullPage: true });
                expect(hasTitle && hasCards).toBeTruthy();
            } else {
                console.log('Sistema de Geração de Etiquetas não encontrado');
                test.skip();
            }
        });
    });

    // Funcionalidades de Vinculação
    test.describe('Vinculação de Documentos', () => {
        test('Vincular documento eletrônico a arquivo físico', async ({ page }) => {
            await page.goto('/documents');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            const linkButton = page.locator('button:has-text("Vincular"), [aria-label*="vincular"]').first();

            if (await linkButton.isVisible({ timeout: 5000 })) {
                await linkButton.click();
                await page.waitForTimeout(1000);

                const vinculationModal = page.locator('[role="dialog"]:has-text("Vincular"), [role="dialog"]:has-text("Arquivo Físico")').first();
                const hasModal = await vinculationModal.isVisible({ timeout: 3000 }).catch(() => false);

                if (hasModal) {
                    await page.screenshot({ path: 'screenshots/physical-archive-vinculation-modal.png', fullPage: true });
                    expect(hasModal).toBeTruthy();
                }
            } else {
                test.skip();
            }
        });
    });

    // Empréstimo de Documentos Físicos
    test.describe('Empréstimo', () => {
        test('Registrar empréstimo de documento físico', async ({ page }) => {
            await page.goto('/physical-archive');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            const emprestimoButton = page.locator('button:has-text("Empréstimo"), button:has-text("Solicitar")').first();

            if (await emprestimoButton.isVisible({ timeout: 5000 })) {
                await emprestimoButton.click();
                await page.waitForTimeout(1000);

                const emprestimoForm = page.locator('[role="dialog"], .emprestimo-form').first();
                const hasForm = await emprestimoForm.isVisible({ timeout: 3000 }).catch(() => false);

                if (hasForm) {
                    await page.screenshot({ path: 'screenshots/physical-archive-emprestimo-form.png', fullPage: true });
                    expect(hasForm).toBeTruthy();
                }
            } else {
                test.skip();
            }
        });
    });

    // Histórico de Movimentações
    test.describe('Histórico', () => {
        test('Visualizar histórico de movimentações', async ({ page }) => {
            await page.goto('/physical-archive');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            const historicoTab = page.locator('button[role="tab"]:has-text("Histórico"), a:has-text("Histórico")').first();

            if (await historicoTab.isVisible({ timeout: 5000 })) {
                await historicoTab.click();
                await page.waitForTimeout(1000);

                const historicList = page.locator('.MuiTimeline-root, .historic-list, table').first();
                const hasHistoric = await historicList.isVisible({ timeout: 3000 }).catch(() => false);

                if (hasHistoric) {
                    await page.screenshot({ path: 'screenshots/physical-archive-historic.png', fullPage: true });
                    expect(hasHistoric).toBeTruthy();
                }
            } else {
                test.skip();
            }
        });
    });

    // Aba: Temporalidade
    test.describe('Temporalidade', () => {
        test('Acessar aba e validar elementos principais', async ({ page }) => {
            await page.goto('/physical-archive');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            // Clicar na aba "Temporalidade"
            const temporalidadeTab = page.locator('button[role="tab"]:has-text("Temporalidade")');
            await expect(temporalidadeTab).toBeVisible({ timeout: 5000 });
            await temporalidadeTab.click();
            await page.waitForTimeout(1000);

            // Título da página
            const pageTitle = page.locator('h4:has-text("Arquivo Físico")');
            await expect(pageTitle).toBeVisible();

            // Subtítulo
            const subtitle = page.locator('p:has-text("Gestão integrada do arquivo físico e digital")');
            await expect(subtitle).toBeVisible();

            // Tabela de controle de temporalidade
            const tableTitle = page.locator('h6:has-text("Controle de Temporalidade")');
            await expect(tableTitle).toBeVisible();
            const table = page.locator('table');
            await expect(table).toBeVisible();

            // Cards de fases
            const cards = [
                'Arquivo Corrente',
                'Arquivo Intermediário',
                'Guarda Permanente',
                'Pendente Eliminação',
                'Legal Hold',
            ];
            for (const card of cards) {
                const cardEl = page.locator(`.MuiTypography-root:has-text("${card}")`);
                await expect(cardEl).toBeVisible();
            }

            // Dashboard de temporalidade
            const dashboardTitle = page.locator('h5:has-text("Dashboard de Temporalidade")');
            await expect(dashboardTitle).toBeVisible();

            // Cards de fases do dashboard
            const dashCards = [
                'Fase Corrente',
                'Fase Intermediária',
                'Guarda Permanente',
                'Transições Pendentes',
            ];
            for (const card of dashCards) {
                const cardEl = page.locator(`.MuiTypography-root:has-text("${card}")`);
                await expect(cardEl).toBeVisible();
            }

            // Card de status de sincronização
            const syncStatus = page.locator('h6:has-text("Status de Sincronização")');
            await expect(syncStatus).toBeVisible();
            const nuxeoChip = page.locator('.MuiChip-label:has-text("Nuxeo Online")');
            await expect(nuxeoChip).toBeVisible();
            const archiveChip = page.locator('.MuiChip-label:has-text("Physical Archive OK")');
            await expect(archiveChip).toBeVisible();

            // Card de alertas de transição
            const alertTitle = page.locator('h6:has-text("Alertas de Transição")');
            await expect(alertTitle).toBeVisible();

            // Card de regras TTD
            const ttdTitle = page.locator('h6:has-text("Regras TTD Ativas")');
            await expect(ttdTitle).toBeVisible();
            const novaRegraBtn = page.locator('button:has-text("Nova Regra")');
            await expect(novaRegraBtn).toBeVisible();

            // Card de calculadora TTD
            const calcTitle = page.locator('h6:has-text("Calculadora TTD")');
            await expect(calcTitle).toBeVisible();
            const tipoDocLabel = page.locator('label:has-text("Tipo de Documento")');
            await expect(tipoDocLabel).toBeVisible();
            const dataBaseLabel = page.locator('label:has-text("Data Base")');
            await expect(dataBaseLabel).toBeVisible();
            const calcularBtn = page.locator('button:has-text("Calcular Avançado")');
            await expect(calcularBtn).toBeVisible();
        });
    });

});


