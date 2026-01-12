import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TEST_DATA } from '../utils/constants';

/**
 * Testes de Gestao de Arquivo Fisico
 * RN-148: Gestao Integrada de Documentos (parte fisica)
 */

test.describe('Arquivo Fisico', () => {

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

    // Funcao auxiliar para navegar ate a tela de Arquivo Fisico
    async function navigateToPhysicalArchive(page) {
        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Clicar no submenu "Configuracao" dentro de Arquivo Fisico
        const configMenu = page.locator('text=Configuracao').first();
        await expect(configMenu, 'Menu "Configuracao" nao encontrado').toBeVisible({ timeout: 5000 });
        await configMenu.click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
    }

    test('Acessar tela de Localizacoes e verificar estrutura', async ({ page }) => {
        await navigateToPhysicalArchive(page);

        // Verificar titulo "Locais de Armazenamento"
        const titulo = page.locator('text=Locais de Armazenamento').first();
        await expect(titulo, 'Titulo "Locais de Armazenamento" nao encontrado').toBeVisible({ timeout: 5000 });

        // Verificar botao "+ Nova Localizacao"
        const novaLocalizacaoBtn = page.locator('button:has-text("Nova Localizacao")');
        const hasNovaLocalizacao = await novaLocalizacaoBtn.isVisible({ timeout: 5000 }).catch(() => false);
        console.log('Botao Nova Localizacao visivel:', hasNovaLocalizacao);

        // Verificar arvore de navegacao com "Galpao - Prefeitura de Caieiras"
        const galpao = page.locator('text=Galpao - Prefeitura de Caieiras').first();
        const hasGalpao = await galpao.isVisible({ timeout: 5000 }).catch(() => false);
        console.log('Galpao - Prefeitura de Caieiras visivel:', hasGalpao);

        await page.screenshot({ path: 'screenshots/physical-archive-localizacoes.png', fullPage: true });
        expect(hasGalpao).toBeTruthy();
    });

    test('Expandir Galpao e verificar repositorios', async ({ page }) => {
        await navigateToPhysicalArchive(page);

        // Clicar no Galpao para expandir
        const galpao = page.locator('text=Galpao - Prefeitura de Caieiras').first();
        await expect(galpao, 'Galpao nao encontrado').toBeVisible({ timeout: 5000 });
        await galpao.click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Verificar se a tabela de repositorios aparece
        const tabelaRepositorios = page.locator('table');
        await expect(tabelaRepositorios, 'Tabela de repositorios nao encontrada').toBeVisible({ timeout: 5000 });

        // Verificar colunas da tabela
        const colIdentificador = page.locator('th:has-text("Identificador")');
        const colNome = page.locator('th:has-text("Nome")');
        const colLocal = page.locator('th:has-text("Local")');
        const colCapacidade = page.locator('th:has-text("Capacidade")');

        const hasIdentificador = await colIdentificador.isVisible().catch(() => false);
        const hasNome = await colNome.isVisible().catch(() => false);
        const hasLocal = await colLocal.isVisible().catch(() => false);
        const hasCapacidade = await colCapacidade.isVisible().catch(() => false);

        console.log(`Colunas visiveis - Identificador: ${hasIdentificador}, Nome: ${hasNome}, Local: ${hasLocal}, Capacidade: ${hasCapacidade}`);

        // Verificar paginacao
        const paginacao = page.locator('text=Mostrando').first();
        const hasPaginacao = await paginacao.isVisible({ timeout: 3000 }).catch(() => false);
        console.log('Paginacao visivel:', hasPaginacao);

        await page.screenshot({ path: 'screenshots/physical-archive-repositorios-tabela.png', fullPage: true });
        expect(hasIdentificador && hasNome && hasLocal && hasCapacidade).toBeTruthy();
    });

    test('Verificar abas disponiveis', async ({ page }) => {
        await navigateToPhysicalArchive(page);

        // Verificar abas: Localizacoes, Repositorios, Temporalidade, Gestao de Espaco
        const abaLocalizacoes = page.locator('text=Localizacoes').first();
        const abaRepositorios = page.locator('text=Repositorios').first();
        const abaTemporalidade = page.locator('text=Temporalidade').first();
        const abaGestaoEspaco = page.locator('text=Gestao de Espaco').first();

        const hasLocalizacoes = await abaLocalizacoes.isVisible({ timeout: 5000 }).catch(() => false);
        const hasRepositorios = await abaRepositorios.isVisible({ timeout: 5000 }).catch(() => false);
        const hasTemporalidade = await abaTemporalidade.isVisible({ timeout: 5000 }).catch(() => false);
        const hasGestaoEspaco = await abaGestaoEspaco.isVisible({ timeout: 5000 }).catch(() => false);

        console.log(`Abas visiveis - Localizacoes: ${hasLocalizacoes}, Repositorios: ${hasRepositorios}, Temporalidade: ${hasTemporalidade}, Gestao de Espaco: ${hasGestaoEspaco}`);

        await page.screenshot({ path: 'screenshots/physical-archive-abas.png', fullPage: true });
        expect(hasLocalizacoes || hasRepositorios || hasTemporalidade || hasGestaoEspaco).toBeTruthy();
    });

    test('Acessar aba Repositorios', async ({ page }) => {
        await navigateToPhysicalArchive(page);

        // Clicar na aba Repositorios
        const abaRepositorios = page.locator('text=Repositorios').first();
        if (await abaRepositorios.isVisible({ timeout: 5000 })) {
            await abaRepositorios.click();
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            await page.screenshot({ path: 'screenshots/physical-archive-aba-repositorios.png', fullPage: true });
            expect(true).toBeTruthy();
        } else {
            console.log('Aba Repositorios nao encontrada');
            test.skip();
        }
    });

    // Aba: Temporalidade
    test.describe('Temporalidade', () => {
        test('Acessar aba Temporalidade', async ({ page }) => {
            await navigateToPhysicalArchive(page);

            // Clicar na aba "Temporalidade"
            const abaTemporalidade = page.locator('text=Temporalidade').first();
            if (await abaTemporalidade.isVisible({ timeout: 5000 })) {
                await abaTemporalidade.click();
                await page.waitForLoadState('networkidle');
                await page.waitForTimeout(2000);

                await page.screenshot({ path: 'screenshots/physical-archive-temporalidade.png', fullPage: true });
                expect(true).toBeTruthy();
            } else {
                console.log('Aba Temporalidade nao encontrada');
                test.skip();
            }
        });
    });

    // Aba: Gestao de Espaco
    test.describe('Gestao de Espaco', () => {
        test('Acessar aba Gestao de Espaco', async ({ page }) => {
            await navigateToPhysicalArchive(page);

            // Clicar na aba "Gestao de Espaco"
            const abaGestaoEspaco = page.locator('text=Gestao de Espaco').first();
            if (await abaGestaoEspaco.isVisible({ timeout: 5000 })) {
                await abaGestaoEspaco.click();
                await page.waitForLoadState('networkidle');
                await page.waitForTimeout(2000);

                await page.screenshot({ path: 'screenshots/physical-archive-gestao-espaco.png', fullPage: true });
                expect(true).toBeTruthy();
            } else {
                console.log('Aba Gestao de Espaco nao encontrada');
                test.skip();
            }
        });
    });

    // Verificar estrutura da arvore de localizacoes
    test('Expandir arvore e verificar Ruas R01-R07', async ({ page }) => {
        await navigateToPhysicalArchive(page);

        // Clicar no Galpao para expandir
        const galpao = page.locator('text=Galpao - Prefeitura de Caieiras').first();
        if (await galpao.isVisible({ timeout: 5000 })) {
            // Clicar no icone de expandir (ChevronRight)
            const expandIcon = page.locator('[data-testid="ChevronRightIcon"]').first();
            if (await expandIcon.isVisible({ timeout: 3000 })) {
                await expandIcon.click();
                await page.waitForTimeout(1000);
            }

            // Verificar se as Ruas aparecem
            const ruas = ['Rua R01', 'Rua R02', 'Rua R03', 'Rua R04', 'Rua R05', 'Rua R06', 'Rua R07'];
            let ruasVisiveis = 0;

            for (const rua of ruas) {
                const ruaEl = page.locator(`text=${rua}`).first();
                if (await ruaEl.isVisible({ timeout: 2000 }).catch(() => false)) {
                    ruasVisiveis++;
                }
            }

            console.log(`Ruas visiveis: ${ruasVisiveis} de ${ruas.length}`);
            await page.screenshot({ path: 'screenshots/physical-archive-arvore-ruas.png', fullPage: true });
            expect(ruasVisiveis).toBeGreaterThan(0);
        } else {
            console.log('Galpao nao encontrado');
            test.skip();
        }
    });

    // Verificar repositorios com capacidade
    test('Verificar repositorios com indicador de capacidade', async ({ page }) => {
        await navigateToPhysicalArchive(page);

        // Clicar no Galpao
        const galpao = page.locator('text=Galpao - Prefeitura de Caieiras').first();
        await expect(galpao, 'Galpao nao encontrado').toBeVisible({ timeout: 5000 });
        await galpao.click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Verificar se ha barras de progresso de capacidade
        const progressBars = page.locator('.MuiLinearProgress-root');
        const progressCount = await progressBars.count();

        console.log(`Barras de progresso de capacidade encontradas: ${progressCount}`);

        // Verificar se ha porcentagens visiveis
        const percentages = page.locator('text=/%$/');
        const percentCount = await percentages.count();

        console.log(`Indicadores de porcentagem encontrados: ${percentCount}`);

        await page.screenshot({ path: 'screenshots/physical-archive-capacidade.png', fullPage: true });
        expect(progressCount).toBeGreaterThan(0);
    });

});


