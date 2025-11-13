#!/usr/bin/env node
/**
 * Script para gerar relatório customizado após execução dos testes
 */

import { ReportGenerator } from '../utils/report-generator';

async function main() {
    console.log('🚀 Gerando relatório customizado...\n');
    
    const generator = new ReportGenerator();
    const outputDir = process.argv[2] || 'custom-report';
    
    await generator.generateReport(outputDir);
    
    console.log('\n✨ Relatório gerado com sucesso!');
    console.log(`📂 Abra o arquivo: ${outputDir}/index.html\n`);
}

main().catch(error => {
    console.error('❌ Erro ao gerar relatório:', error);
    process.exit(1);
});
