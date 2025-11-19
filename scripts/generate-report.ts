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

    // Copiar o relatório Playwright para dentro do custom report
    function copyPlaywrightReport(reportDir: string) {
        // Detecta o ambiente pelo nome do diretório de saída
        let env = 'dev';
        const match = reportDir.match(/custom-report-(\w+)/);
        if (match && match[1]) env = match[1];
        const src = path.resolve(`playwright-report-${env}`);
        const dest = path.join(reportDir, 'playwright-report');
        if (fs.existsSync(src)) {
            // Remove destino se já existir
            if (fs.existsSync(dest)) {
                fs.rmSync(dest, { recursive: true, force: true });
            }
            fs.mkdirSync(dest, { recursive: true });
            // Copia todos os arquivos do src para dest
            for (const file of fs.readdirSync(src)) {
                const srcFile = path.join(src, file);
                const destFile = path.join(dest, file);
                if (fs.lstatSync(srcFile).isDirectory()) {
                    fs.cpSync(srcFile, destFile, { recursive: true });
                } else {
                    fs.copyFileSync(srcFile, destFile);
                }
            }
            console.log(`✅ Copiado relatório Playwright de ${src} para ${dest}`);
        } else {
            console.warn(`⚠️  Pasta do relatório Playwright não encontrada: ${src}`);
        }
    }

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

    // Copia o relatório Playwright e adiciona o iframe
    copyPlaywrightReport(outputDir);
    addPlaywrightIframe(outputDir);

    console.log('\n✨ Relatório gerado com sucesso!');
    console.log(`📂 Abra o arquivo: ${outputDir}/index.html\n`);
}

main().catch(error => {
    console.error('❌ Erro ao gerar relatório:', error);
    process.exit(1);
});
