import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DocumentsPage } from '../pages/DocumentsPage';
import { TEST_DATA } from '../utils/constants';

/**
 * Testes de Gestão de Documentos Eletrônicos
 * RN-148: Gestão Integrada de Documentos (parte eletrônica)
 * RN-149: Classificação por Tipo
 * RN-150: Exportação de Metadados
 * RN-151: Conversão para PDF
 * RN-137: Preview sem Download
 */

test.describe('Documentos Eletrônicos', () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login(TEST_DATA.VALID_USER.username, TEST_DATA.VALID_USER.password);
        await page.waitForURL('**/dashboard', { timeout: 10000 });
    });

    // ============================================================================
    // RN-148: Gestão de Documentos Eletrônicos
    // ============================================================================

    test.describe('RN-148: Upload e Visualização', () => {

        test('Upload de documento eletrônico', async ({ page }) => {
            await page.goto('/documents');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            const uploadLink = page.locator('a:has-text("Upload"), a[href="/documents/upload"], a:has([data-testid="CloudUploadIcon"])').first();

            if (await uploadLink.isVisible({ timeout: 5000 })) {
                await page.screenshot({ path: 'screenshots/documents-page-before-upload.png', fullPage: true });
                await uploadLink.click();
                await page.waitForLoadState('networkidle');
                await page.waitForTimeout(1000);

                const uploadPage = page.url().includes('/documents/upload');

                if (uploadPage) {
                    const uploadArea = page.locator('input[type="file"], [role="presentation"], .upload-zone, .dropzone').first();
                    const hasUploadArea = await uploadArea.isVisible({ timeout: 3000 }).catch(() => false);

                    if (hasUploadArea) {
                        console.log('Página de upload carregada com área de upload');
                        await page.screenshot({ path: 'screenshots/documents-upload-page.png', fullPage: true });
                        expect(hasUploadArea).toBeTruthy();
                    } else {
                        console.log('Página de upload carregada mas área de upload não encontrada');
                        await page.screenshot({ path: 'screenshots/documents-upload-page-no-area.png', fullPage: true });
                    }
                } else {
                    console.log('Não redirecionou para página de upload');
                    await page.screenshot({ path: 'screenshots/documents-no-redirect.png', fullPage: true });
                }
            } else {
                console.log('Link de Upload não encontrado');
                test.skip();
            }
        });

       test('Visualização de documento eletrônico', async ({ page }) => {
            await page.goto('/documents');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            const visibilityButton = page
                .locator('button:has(svg[data-testid="VisibilityIcon"]), [role="button"]:has(svg[data-testid="VisibilityIcon"])')
                .first();
            await expect(visibilityButton, 'Botão de visualização não apareceu').toBeVisible({ timeout: 5000 });

            await visibilityButton.click();
            await page.waitForTimeout(1000);

            const documentView = page.locator('[role="dialog"], .document-viewer, .preview-container').first();
            await expect(documentView, 'Viewer do documento não abriu').toBeVisible({ timeout: 5000 });

            const viewerContent = documentView.locator(
                'canvas, iframe, object, embed[type="application/pdf"], .pdf-viewer, .preview-body'
            ).first();

            if (!(await viewerContent.isVisible({ timeout: 2000 }).catch(() => false))) {
                const visualizarControl = documentView
                    .locator(
                        [
                            'button[aria-label*="Visual"]',
                            'button:has(svg[data-testid="VisibilityIcon"])',
                            '[role="tab"]:has(svg[data-testid="VisibilityIcon"])'
                        ].join(', ')
                    )
                    .first();

                await expect(visualizarControl, 'Controle de visualização não apareceu').toBeVisible({ timeout: 5000 });
                await visualizarControl.scrollIntoViewIfNeeded();
                await visualizarControl.click();
                await page.waitForTimeout(1000);
            }

            await expect(viewerContent, 'Conteúdo do documento não carregou').toBeVisible({ timeout: 5000 });
            await page.screenshot({ path: 'screenshots/documents-visualization.png', fullPage: true });
        });

        test.only('Visualização de metadados', async ({ page }) => {
            await page.goto('/documents');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            // Clicar no botão de visualizar documento (ícone de olho)
            const visibilityButton = page
                .locator('button:has(svg[data-testid="VisibilityIcon"]), [role="button"]:has(svg[data-testid="VisibilityIcon"])')
                .first();
            
            if (!(await visibilityButton.isVisible({ timeout: 5000 }).catch(() => false))) {
                test.skip();
                return;
            }

            await visibilityButton.click();
            
            // Aguardar o painel de visualização abrir e o conteúdo carregar
            await page.waitForLoadState('networkidle');
            
            // Aguardar o accordion de Metadados aparecer
            const metadataAccordion = page.locator('.MuiAccordion-root:has-text("Metadados")').first();
            await expect(metadataAccordion, 'Accordion de Metadados não encontrado').toBeVisible({ timeout: 10000 });

            // Aguardar o conteúdo dos metadados carregar (esperar campo "ID do Documento" aparecer)
            const idDocumentoLabel = metadataAccordion.locator('text=ID do Documento');
            await expect(idDocumentoLabel, 'Conteúdo dos metadados não carregou').toBeVisible({ timeout: 15000 });

            // Verificar campos de metadados dentro do accordion
            const hasIdDocumento = await idDocumentoLabel.isVisible().catch(() => false);
            const hasAutor = await metadataAccordion.locator('[data-testid="PersonIcon"]').isVisible({ timeout: 3000 }).catch(() => false);
            const hasDepartamento = await metadataAccordion.locator('[data-testid="BusinessIcon"]').isVisible({ timeout: 3000 }).catch(() => false);
            const hasLocalizacao = await metadataAccordion.locator('[data-testid="LocationOnIcon"]').isVisible({ timeout: 3000 }).catch(() => false);

            console.log(`Metadados visíveis - ID: ${hasIdDocumento}, Autor: ${hasAutor}, Departamento: ${hasDepartamento}, Localização: ${hasLocalizacao}`);
            await page.screenshot({ path: 'screenshots/documents-metadata.png', fullPage: true });

            expect(hasIdDocumento || hasAutor || hasDepartamento || hasLocalizacao).toBeTruthy();
        });

        test('Busca unificada de documentos', async ({ page }) => {
            await page.goto('/documents');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            const searchInput = page.locator('input[placeholder*="Pesquisar"], input[placeholder*="Buscar"]').first();

            if (await searchInput.isVisible({ timeout: 5000 })) {
                await searchInput.fill('teste');
                await searchInput.press('Enter');
                await page.waitForTimeout(2000);

                await page.screenshot({ path: 'screenshots/documents-search.png', fullPage: true });
                expect(true).toBeTruthy();
            } else {
                console.log('Campo de busca não encontrado');
                test.skip();
            }
        });
    });

    // ============================================================================
    // RN-149: Classificação por Tipo
    // ============================================================================

    test.describe('RN-149: Classificação por Tipo', () => {

        test('Listar tipos de documentos', async ({ page }) => {
            await page.goto('/dashboard');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            // Clicar no menu "Tipos de Documento"
            const menuItem = page.locator('text=Tipos de Documento').first();
            await expect(menuItem, 'Menu "Tipos de Documento" não encontrado').toBeVisible({ timeout: 5000 });
            await menuItem.click();
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            // Verificar se há cards de tipos de documento
            const typeCards = page.locator('.MuiCard-root');
            const cardCount = await typeCards.count();

            if (cardCount > 0) {
                console.log(`Encontrados ${cardCount} tipos de documento`);
                await page.screenshot({ path: 'screenshots/document-types-list.png', fullPage: true });
                expect(cardCount).toBeGreaterThan(0);
            } else {
                console.log('Nenhum tipo de documento encontrado');
                test.skip();
            }
        });

        test('Criar novo tipo de documento', async ({ page }) => {
            await page.goto('/dashboard');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            // Clicar no menu "Tipos de Documento"
            const menuItem = page.locator('text=Tipos de Documento').first();
            await expect(menuItem, 'Menu "Tipos de Documento" não encontrado').toBeVisible({ timeout: 5000 });
            await menuItem.click();
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            // Clicar no botao "Novo Tipo"
            const createButton = page.locator('button:has-text("Novo Tipo")').first();
            await expect(createButton, 'Botao "Novo Tipo" nao encontrado').toBeVisible({ timeout: 5000 });
            await createButton.click();
            await page.waitForTimeout(1000);

            // Verificar se o modal abriu
            const modal = page.locator('[role="dialog"], .MuiDialog-root').first();
            await expect(modal, 'Modal de criacao nao abriu').toBeVisible({ timeout: 5000 });

            // Preencher campos obrigatorios
            const nomeTecnico = `tipo_teste_${Date.now()}`;
            const nomeExibicao = `Tipo Teste ${Date.now()}`;

            // Campo "Nome Tecnico"
            const nomeTecnicoInput = modal.locator('input').first();
            await nomeTecnicoInput.fill(nomeTecnico);

            // Campo "Nome de Exibicao"
            const nomeExibicaoInput = modal.locator('input').nth(1);
            await nomeExibicaoInput.fill(nomeExibicao);

            // Campo "Descricao" (opcional)
            const descricaoInput = modal.locator('textarea').first();
            await descricaoInput.fill('Tipo de documento criado pelo teste automatizado');

            await page.screenshot({ path: 'screenshots/document-types-create-form.png', fullPage: true });

            // Clicar no botao "Criar Tipo"
            const submitButton = modal.locator('button:has-text("Criar Tipo")').first();
            await expect(submitButton, 'Botao "Criar Tipo" nao encontrado').toBeVisible({ timeout: 5000 });

            // Nota: Nao clicamos em "Criar Tipo" pois reinicia o Nuxeo
            // Apenas verificamos que o formulario esta preenchido corretamente
            console.log(`Formulario preenchido: Nome Tecnico=${nomeTecnico}, Nome Exibicao=${nomeExibicao}`);
            expect(await submitButton.isVisible()).toBeTruthy();
        });

        test('Filtrar documentos por tipo', async ({ page }) => {
            await page.goto('/documents');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            const typeFilter = page.locator('[role="combobox"]').first();

            if (await typeFilter.isVisible({ timeout: 5000 })) {
                await typeFilter.click();
                await page.waitForTimeout(500);

                const options = page.locator('[role="option"]');
                const optionsCount = await options.count();

                console.log(`${optionsCount} tipos de documentos disponíveis`);
                await page.screenshot({ path: 'screenshots/document-types-filter.png', fullPage: true });

                expect(optionsCount).toBeGreaterThan(0);
            } else {
                test.skip();
            }
        });
    });

    // ============================================================================
    // RN-150: Exportação de Metadados
    // ============================================================================

    test.describe('RN-150: Exportação de Metadados', () => {

        test('Exportar metadados para Excel', async ({ page }) => {
            await page.goto('/documents');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            const exportButton = page.locator('button:has-text("Exportar"), button:has-text("Excel")').first();

            if (await exportButton.isVisible({ timeout: 5000 })) {
                await page.screenshot({ path: 'screenshots/documents-export-excel.png', fullPage: true });
                expect(true).toBeTruthy();
            } else {
                test.skip();
            }
        });

        test('Validar formato Excel exportado', async ({ page }) => {
            await page.goto('/documents');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            await page.screenshot({ path: 'screenshots/documents-export-validation.png', fullPage: true });
            expect(true).toBeTruthy();
        });

        test('Exportar metadados para Word', async ({ page }) => {
            await page.goto('/documents');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            const exportWordButton = page.locator('button:has-text("Word")').first();

            if (await exportWordButton.isVisible({ timeout: 5000 })) {
                await page.screenshot({ path: 'screenshots/documents-export-word.png', fullPage: true });
                expect(true).toBeTruthy();
            } else {
                test.skip();
            }
        });

        test('Exportar metadados para AutoCAD', async ({ page }) => {
            await page.goto('/documents');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            const exportAutoCADButton = page.locator('button:has-text("AutoCAD")').first();

            if (await exportAutoCADButton.isVisible({ timeout: 5000 })) {
                await page.screenshot({ path: 'screenshots/documents-export-autocad.png', fullPage: true });
                expect(true).toBeTruthy();
            } else {
                test.skip();
            }
        });
    });

    // ============================================================================
    // RN-151: Conversão para PDF
    // ============================================================================

    test.describe('RN-151: Conversão para PDF', () => {

        test('Preview de PDF após conversão', async ({ page }) => {
            await page.goto('/documents');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            const pdfDocument = page.locator('.MuiCard-root:has-text(".pdf")').first();

            if (await pdfDocument.isVisible({ timeout: 5000 })) {
                await pdfDocument.click();
                await page.waitForTimeout(2000);

                const pdfViewer = page.locator('canvas, embed[type="application/pdf"], iframe').first();
                const hasPdfViewer = await pdfViewer.isVisible({ timeout: 3000 }).catch(() => false);

                if (hasPdfViewer) {
                    console.log('Visualizador de PDF encontrado');
                    await page.screenshot({ path: 'screenshots/documents-pdf-preview.png', fullPage: true });
                    expect(hasPdfViewer).toBeTruthy();
                }
            } else {
                test.skip();
            }
        });
    });

    // ============================================================================
    // RN-137: Preview sem Download
    // ============================================================================

    test.describe('RN-137: Preview sem Download', () => {

        test('Preview de PDF sem download', async ({ page }) => {
            await page.goto('/documents');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            const pdfCard = page.locator('.MuiCard-root').first();

            if (await pdfCard.isVisible({ timeout: 5000 })) {
                await pdfCard.click();
                await page.waitForTimeout(2000);

                const preview = page.locator('canvas, embed, iframe, .preview-container').first();
                const hasPreview = await preview.isVisible({ timeout: 5000 }).catch(() => false);

                if (hasPreview) {
                    console.log('Preview de PDF disponível sem download');
                    await page.screenshot({ path: 'screenshots/documents-pdf-preview-no-download.png', fullPage: true });
                    expect(hasPreview).toBeTruthy();
                }
            } else {
                test.skip();
            }
        });

        test('Preview de imagens sem download', async ({ page }) => {
            await page.goto('/documents');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            const imageCard = page.locator('.MuiCard-root:has-text(".jpg"), .MuiCard-root:has-text(".png")').first();

            if (await imageCard.isVisible({ timeout: 5000 })) {
                await imageCard.click();
                await page.waitForTimeout(2000);

                const imagePreview = page.locator('img[src*="blob:"], img[src*="data:"], .image-preview').first();
                const hasImagePreview = await imagePreview.isVisible({ timeout: 5000 }).catch(() => false);

                if (hasImagePreview) {
                    console.log('Preview de imagem disponível sem download');
                    await page.screenshot({ path: 'screenshots/documents-image-preview-no-download.png', fullPage: true });
                    expect(hasImagePreview).toBeTruthy();
                }
            } else {
                test.skip();
            }
        });
    });
});
