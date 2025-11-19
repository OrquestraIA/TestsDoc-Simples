#!/usr/bin/env node
/**
 * Script para gerar relatório customizado após execução dos testes
 */


import { ReportGenerator } from '../utils/report-generator';
import fs from 'fs';
import path from 'path';

async function main() {
    console.log('🚀 Gerando relatório customizado...\n');

    const generator = new ReportGenerator();
    const outputDir = process.argv[2] || 'custom-report';


    await generator.generateReport(outputDir);

    // Função para adicionar o iframe do relatório Playwright
    function addPlaywrightIframe(reportDir: string) {
        const indexPath = path.join(reportDir, 'index.html');
        if (!fs.existsSync(indexPath)) return;
        let html = fs.readFileSync(indexPath, 'utf-8');
        const iframeHtml = `\n<section style="margin: 2em 0; text-align: center;">
            <h2>Relatório Completo do Playwright</h2>
            <iframe src="playwright-report/index.html" width="100%" height="800px" style="border:none;"></iframe>
        </section>\n`;
        // Insere antes do fechamento do body
        html = html.replace(/<\/body>/i, iframeHtml + '</body>');
        fs.writeFileSync(indexPath, html, 'utf-8');
    }

    // Chama a função após gerar o relatório customizado
    addPlaywrightIframe(outputDir);

    console.log('\n✨ Relatório gerado com sucesso!');
    console.log(`📂 Abra o arquivo: ${outputDir}/index.html\n`);
}

main().catch(error => {
    console.error('❌ Erro ao gerar relatório:', error);
    process.exit(1);
});
