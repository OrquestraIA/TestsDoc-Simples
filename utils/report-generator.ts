/**
 * Gerador de Relatório Customizado
 * Gera dashboard HTML com estatísticas dos testes e links para documentação
 */

import * as fs from 'fs';
import * as path from 'path';

export interface TestResult {
    testFile: string;
    testName: string;
    status: 'passed' | 'failed' | 'skipped';
    duration: number;
    error?: string;
    browser: string;
}

export interface TestSummary {
    totalTests: number;
    passed: number;
    failed: number;
    skipped: number;
    successRate: number;
    totalDuration: number;
    executor: string;
    environment: string;
    startTime: Date;
    endTime: Date;
    browsers: string[];
    tool: string;
    version: string;
}

export interface ModuleDocumentation {
    module: string;
    docPath: string;
    testsCount: number;
}

export class ReportGenerator {
    private results: TestResult[] = [];
    private summary: TestSummary;
    private githubBaseUrl: string = 'https://github.com/OrquestraIA/TestsDoc-Simples/blob/main';
    private modulesDocs: ModuleDocumentation[] = [
        { module: 'Autenticação', docPath: 'docs/CASOS_DE_TESTE_AUTENTICACAO.md', testsCount: 4 },
        { module: 'Documentos', docPath: 'docs/CASOS_DE_TESTE_DOCUMENTOS.md', testsCount: 2 },
        { module: 'Arquivo Físico', docPath: 'docs/CASOS_DE_TESTE_ARQUIVO_FISICO.md', testsCount: 8 },
    ];

    constructor() {
        this.summary = {
            totalTests: 0,
            passed: 0,
            failed: 0,
            skipped: 0,
            successRate: 0,
            totalDuration: 0,
            executor: process.env.USER || process.env.USERNAME || 'Sistema',
            environment: process.env.ENVIRONMENT || 'dev',
            startTime: new Date(),
            endTime: new Date(),
            browsers: [],
            tool: 'Playwright',
            version: '1.40.0',
        };
    }

    async generateReport(outputDir: string = 'custom-report'): Promise<void> {
        // Ler resultados do Playwright
        await this.parsePlaywrightResults();

        // Criar diretório de saída
        const reportDir = path.join(process.cwd(), outputDir);
        if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir, { recursive: true });
        }

        // Gerar HTML
        const htmlContent = this.generateHTML();
        fs.writeFileSync(path.join(reportDir, 'index.html'), htmlContent);

        // Copiar assets (CSS, JS)
        this.copyAssets(reportDir);

        console.log(`✅ Relatório customizado gerado em: ${reportDir}/index.html`);
    }

    private async parsePlaywrightResults(): Promise<void> {
        const resultsPath = path.join(process.cwd(), 'test-results');

        try {
            // Procurar por arquivos JSON de resultado
            const files = fs.readdirSync(resultsPath);
            const jsonFiles = files.filter(f => f.endsWith('.json') && f.startsWith('results-'));

            for (const file of jsonFiles) {
                // Detectar ambiente do nome do arquivo (results-dev.json, results-homolog.json, etc)
                const envMatch = file.match(/results-(\w+)\.json/);
                if (envMatch) {
                    this.summary.environment = envMatch[1];
                }

                const content = JSON.parse(
                    fs.readFileSync(path.join(resultsPath, file), 'utf-8')
                );
                this.processPlaywrightJson(content);
            }
        } catch (error) {
            console.warn('Não foi possível ler resultados do Playwright:', error);
        }

        this.calculateSummary();
    }

    private processPlaywrightJson(data: any): void {
        if (!data.suites) return;

        const extractTests = (suite: any, browser: string = 'chromium') => {
            if (suite.specs) {
                suite.specs.forEach((spec: any) => {
                    const testResult: TestResult = {
                        testFile: suite.file || 'unknown',
                        testName: spec.title,
                        status: this.mapStatus(spec.tests?.[0]?.results?.[0]?.status),
                        duration: spec.tests?.[0]?.results?.[0]?.duration || 0,
                        error: spec.tests?.[0]?.results?.[0]?.error?.message,
                        browser: browser,
                    };
                    this.results.push(testResult);
                });
            }

            if (suite.suites) {
                suite.suites.forEach((s: any) => extractTests(s, browser));
            }
        };

        data.suites.forEach((suite: any) => extractTests(suite));
    }

    private mapStatus(status: string): 'passed' | 'failed' | 'skipped' {
        if (status === 'passed') return 'passed';
        if (status === 'failed') return 'failed';
        return 'skipped';
    }

    private calculateSummary(): void {
        this.summary.totalTests = this.results.length;
        this.summary.passed = this.results.filter(r => r.status === 'passed').length;
        this.summary.failed = this.results.filter(r => r.status === 'failed').length;
        this.summary.skipped = this.results.filter(r => r.status === 'skipped').length;
        this.summary.totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
        this.summary.successRate = this.summary.totalTests > 0
            ? (this.summary.passed / this.summary.totalTests) * 100
            : 0;
        this.summary.browsers = [...new Set(this.results.map(r => r.browser))];
        this.summary.endTime = new Date();
    }

    private generateHTML(): string {
        return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard de Testes - Doc+Simples</title>
    <style>
        ${this.getCSS()}
    </style>
</head>
<body>
    <div class="container">
        ${this.generateHeader()}
        ${this.generateStatsCards()}
        ${this.generateExecutionInfo()}
        ${this.generateModulesDocumentation()}
        ${this.generateTestResults()}
        ${this.generatePlaywrightLink()}
    </div>
    <script>
        ${this.getJavaScript()}
    </script>
</body>
</html>`;
    }

    private generateHeader(): string {
        const statusIcon = this.summary.failed === 0 ? '✅' : '❌';
        const statusText = this.summary.failed === 0 ? 'Todos os testes passaram!' : 'Alguns testes falharam';
        const statusClass = this.summary.failed === 0 ? 'success' : 'error';

        return `
        <header class="header">
            <h1>📊 Dashboard de Testes E2E</h1>
            <p class="subtitle">Doc+Simples - Relatório Customizado</p>
            <div class="status-badge ${statusClass}">
                <span class="status-icon">${statusIcon}</span>
                <span>${statusText}</span>
            </div>
        </header>`;
    }

    private generateStatsCards(): string {
        const successRateColor = this.summary.successRate >= 90 ? '#10b981' :
            this.summary.successRate >= 70 ? '#f59e0b' : '#ef4444';

        return `
        <section class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">📝</div>
                <div class="stat-content">
                    <h3>Total de Testes</h3>
                    <p class="stat-value">${this.summary.totalTests}</p>
                </div>
            </div>

            <div class="stat-card success">
                <div class="stat-icon">✅</div>
                <div class="stat-content">
                    <h3>Passou</h3>
                    <p class="stat-value">${this.summary.passed}</p>
                </div>
            </div>

            <div class="stat-card error">
                <div class="stat-icon">❌</div>
                <div class="stat-content">
                    <h3>Falhou</h3>
                    <p class="stat-value">${this.summary.failed}</p>
                </div>
            </div>

            <div class="stat-card warning">
                <div class="stat-icon">⏭️</div>
                <div class="stat-content">
                    <h3>Ignorado</h3>
                    <p class="stat-value">${this.summary.skipped}</p>
                </div>
            </div>

            <div class="stat-card" style="grid-column: span 2;">
                <div class="stat-icon">📈</div>
                <div class="stat-content">
                    <h3>Taxa de Sucesso</h3>
                    <div class="progress-container">
                        <div class="progress-bar" style="width: ${this.summary.successRate}%; background-color: ${successRateColor};">
                            <span class="progress-text">${this.summary.successRate.toFixed(2)}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="stat-card" style="grid-column: span 2;">
                <div class="stat-icon">⏱️</div>
                <div class="stat-content">
                    <h3>Tempo Total de Execução</h3>
                    <p class="stat-value">${this.formatDuration(this.summary.totalDuration)}</p>
                </div>
            </div>
        </section>`;
    }

    private generateExecutionInfo(): string {
        return `
        <section class="info-section">
            <h2>ℹ️ Informações da Execução</h2>
            <div class="info-grid">
                <div class="info-item">
                    <strong>👤 Executor:</strong>
                    <span>${this.summary.executor}</span>
                </div>
                <div class="info-item">
                    <strong>🔧 Ferramenta:</strong>
                    <span>${this.summary.tool} ${this.summary.version}</span>
                </div>
                <div class="info-item">
                    <strong>🌍 Ambiente:</strong>
                    <span class="badge badge-${this.summary.environment}">${this.summary.environment.toUpperCase()}</span>
                </div>
                <div class="info-item">
                    <strong>🌐 Browsers:</strong>
                    <span>${this.summary.browsers.map(b => `<span class="badge">${b}</span>`).join(' ')}</span>
                </div>
                <div class="info-item">
                    <strong>🕐 Início:</strong>
                    <span>${this.formatDateTime(this.summary.startTime)}</span>
                </div>
                <div class="info-item">
                    <strong>🕐 Fim:</strong>
                    <span>${this.formatDateTime(this.summary.endTime)}</span>
                </div>
            </div>
        </section>`;
    }

    private generateModulesDocumentation(): string {
        const testedModules = this.getTestedModules();
        const allModulesTested = testedModules.length === this.modulesDocs.length;
        
        // Se todos os módulos foram testados, mostra apenas link para documentação completa
        if (allModulesTested) {
            return `
        <section class="docs-section">
            <h2>📚 Documentação dos Testes</h2>
            <div class="all-docs-link" style="text-align: center; padding: 3rem 0;">
                <p style="margin-bottom: 2rem; color: #6b7280; font-size: 1.1rem;">
                    Todos os módulos foram testados! Veja a documentação completa consolidada:
                </p>
                <a href="${this.githubBaseUrl}/docs/CASOS_DE_TESTE_COMPLETO.md" class="btn btn-large" target="_blank">
                    📋 Ver Documentação Completa (${this.summary.totalTests} Casos de Teste)
                </a>
            </div>
        </section>`;
        }
        
        // Caso contrário, filtrar e mostrar apenas módulos testados
        const testedModuleDocs = this.modulesDocs.filter(module => 
            testedModules.includes(module.module)
        );

        return `
        <section class="docs-section">
            <h2>📚 Documentação dos Testes</h2>
            <div class="docs-grid">
                ${testedModuleDocs.map(module => {
            return `
                    <div class="doc-card tested">
                        <div class="doc-header">
                            <span class="doc-icon">✅</span>
                            <h3>${module.module}</h3>
                        </div>
                        <p class="doc-info">${module.testsCount} casos de teste documentados</p>
                        <a href="${this.githubBaseUrl}/${module.docPath}" class="doc-link" target="_blank">
                            📖 Ver Documentação
                        </a>
                    </div>`;
        }).join('')}
            </div>
            <div class="all-docs-link">
                <a href="${this.githubBaseUrl}/docs/CASOS_DE_TESTE_COMPLETO.md" class="btn btn-primary" target="_blank">
                    📋 Ver Documentação Completa de Todos os Testes
                </a>
            </div>
        </section>`;
    }

    private generateTestResults(): string {
        const groupedByFile = this.groupTestsByFile();

        return `
        <section class="results-section">
            <h2>🧪 Resultados Detalhados</h2>
            ${Object.entries(groupedByFile).map(([file, tests]) => `
                <div class="test-file-group">
                    <h3 class="file-name">📄 ${this.getModuleName(file)}</h3>
                    <div class="tests-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>Nome do Teste</th>
                                    <th>Browser</th>
                                    <th>Duração</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tests.map(test => `
                                    <tr class="test-row ${test.status}">
                                        <td>
                                            <span class="status-badge ${test.status}">
                                                ${this.getStatusIcon(test.status)}
                                            </span>
                                        </td>
                                        <td>${test.testName}</td>
                                        <td><span class="badge">${test.browser}</span></td>
                                        <td>${this.formatDuration(test.duration)}</td>
                                    </tr>
                                    ${test.error ? `
                                    <tr class="error-row">
                                        <td colspan="4">
                                            <div class="error-message">
                                                <strong>❌ Erro:</strong>
                                                <pre>${this.escapeHtml(test.error)}</pre>
                                            </div>
                                        </td>
                                    </tr>
                                    ` : ''}
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `).join('')}
        </section>`;
    }

    private generatePlaywrightLink(): string {
        return `
        <section class="playwright-section">
            <h2>🎭 Relatório Completo do Playwright</h2>
            <p>Para ver o relatório interativo completo com traces, screenshots e vídeos:</p>
            <a href="../playwright-report-${this.summary.environment}/index.html" class="btn btn-large" target="_blank">
                🎭 Abrir Relatório Playwright
            </a>
        </section>`;
    }

    private getTestedModules(): string[] {
        const testedFiles = [...new Set(this.results.map(r => this.getModuleName(r.testFile)))];
        return this.modulesDocs
            .filter(m => testedFiles.includes(m.module))
            .map(m => m.module);
    }

    private getModuleName(filePath: string): string {
        if (filePath.includes('auth')) return 'Autenticação';
        if (filePath.includes('documents')) return 'Documentos';
        if (filePath.includes('physical-archive')) return 'Arquivo Físico';
        return path.basename(filePath, '.spec.ts');
    }

    private groupTestsByFile(): Record<string, TestResult[]> {
        const grouped: Record<string, TestResult[]> = {};

        this.results.forEach(result => {
            const key = result.testFile;
            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(result);
        });

        return grouped;
    }

    private getStatusIcon(status: string): string {
        switch (status) {
            case 'passed': return '✅';
            case 'failed': return '❌';
            case 'skipped': return '⏭️';
            default: return '❓';
        }
    }

    private formatDuration(ms: number): string {
        if (ms < 1000) return `${ms}ms`;
        const seconds = (ms / 1000).toFixed(2);
        return `${seconds}s`;
    }

    private formatDateTime(date: Date): string {
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    }

    private escapeHtml(text: string): string {
        const div = { textContent: text };
        return div.textContent || '';
    }

    private copyAssets(reportDir: string): void {
        // Assets são inline no HTML, não precisa copiar arquivos
    }

    private getCSS(): string {
        return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 2rem;
            color: #1f2937;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 2rem;
        }

        .header {
            text-align: center;
            margin-bottom: 3rem;
            padding-bottom: 2rem;
            border-bottom: 2px solid #e5e7eb;
        }

        .header h1 {
            font-size: 2.5rem;
            color: #111827;
            margin-bottom: 0.5rem;
        }

        .subtitle {
            color: #6b7280;
            font-size: 1.1rem;
            margin-bottom: 1rem;
        }

        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            border-radius: 9999px;
            font-weight: 600;
            font-size: 1.1rem;
        }

        .status-badge.success {
            background: #d1fae5;
            color: #065f46;
        }

        .status-badge.error {
            background: #fee2e2;
            color: #991b1b;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 3rem;
        }

        .stat-card {
            background: linear-gradient(135deg, #f3f4f6 0%, #ffffff 100%);
            border-radius: 12px;
            padding: 1.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
        }

        .stat-card.success {
            background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
        }

        .stat-card.error {
            background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
        }

        .stat-card.warning {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        }

        .stat-icon {
            font-size: 2.5rem;
        }

        .stat-content h3 {
            font-size: 0.875rem;
            color: #6b7280;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }

        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: #111827;
        }

        .progress-container {
            width: 100%;
            height: 40px;
            background: #e5e7eb;
            border-radius: 9999px;
            overflow: hidden;
            position: relative;
        }

        .progress-bar {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: width 0.3s ease;
            border-radius: 9999px;
        }

        .progress-text {
            color: white;
            font-weight: 700;
            font-size: 1.1rem;
        }

        .info-section, .docs-section, .results-section, .playwright-section {
            margin-bottom: 3rem;
        }

        h2 {
            font-size: 1.75rem;
            margin-bottom: 1.5rem;
            color: #111827;
            border-left: 4px solid #667eea;
            padding-left: 1rem;
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1rem;
            background: #f9fafb;
            padding: 1.5rem;
            border-radius: 12px;
        }

        .info-item {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
        }

        .info-item strong {
            color: #374151;
        }

        .badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            background: #e5e7eb;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 600;
        }

        .badge-dev {
            background: #dbeafe;
            color: #1e40af;
        }

        .badge-homolog {
            background: #fef3c7;
            color: #92400e;
        }

        .badge-prod {
            background: #fee2e2;
            color: #991b1b;
        }

        .docs-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .doc-card {
            background: white;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            padding: 1.5rem;
            transition: all 0.2s;
        }

        .doc-card:hover {
            border-color: #667eea;
            box-shadow: 0 8px 16px rgba(102, 126, 234, 0.2);
        }

        .doc-card.tested {
            border-color: #10b981;
            background: #f0fdf4;
        }

        .doc-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 0.75rem;
        }

        .doc-icon {
            font-size: 2rem;
        }

        .doc-header h3 {
            font-size: 1.25rem;
            color: #111827;
        }

        .doc-info {
            color: #6b7280;
            margin-bottom: 1rem;
        }

        .doc-link {
            display: inline-block;
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.2s;
        }

        .doc-link:hover {
            color: #764ba2;
        }

        .all-docs-link {
            text-align: center;
        }

        .btn {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.2s;
        }

        .btn:hover {
            background: #764ba2;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .btn-large {
            padding: 1rem 2rem;
            font-size: 1.1rem;
        }

        .test-file-group {
            margin-bottom: 2rem;
            background: #f9fafb;
            border-radius: 12px;
            padding: 1.5rem;
        }

        .file-name {
            font-size: 1.25rem;
            margin-bottom: 1rem;
            color: #111827;
        }

        .tests-table {
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            overflow: hidden;
        }

        thead {
            background: #667eea;
            color: white;
        }

        th {
            padding: 1rem;
            text-align: left;
            font-weight: 600;
        }

        td {
            padding: 1rem;
            border-top: 1px solid #e5e7eb;
        }

        .test-row:hover {
            background: #f3f4f6;
        }

        .status-badge.passed {
            color: #065f46;
            font-weight: 700;
        }

        .status-badge.failed {
            color: #991b1b;
            font-weight: 700;
        }

        .status-badge.skipped {
            color: #92400e;
            font-weight: 700;
        }

        .error-row {
            background: #fef2f2;
        }

        .error-message {
            padding: 1rem;
            background: #fee2e2;
            border-left: 4px solid #ef4444;
            border-radius: 4px;
        }

        .error-message pre {
            margin-top: 0.5rem;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-size: 0.875rem;
            color: #991b1b;
        }

        .playwright-section {
            text-align: center;
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
            padding: 2rem;
            border-radius: 12px;
        }

        .playwright-section p {
            margin-bottom: 1.5rem;
            color: #6b7280;
        }

        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }

            .header h1 {
                font-size: 1.75rem;
            }

            .stats-grid {
                grid-template-columns: 1fr;
            }
        }
        `;
    }

    private getJavaScript(): string {
        return `
        // Animação de contadores
        document.addEventListener('DOMContentLoaded', function() {
            const statValues = document.querySelectorAll('.stat-value');
            
            statValues.forEach(element => {
                const finalValue = parseInt(element.textContent);
                if (isNaN(finalValue)) return;
                
                let current = 0;
                const increment = finalValue / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= finalValue) {
                        element.textContent = finalValue;
                        clearInterval(timer);
                    } else {
                        element.textContent = Math.floor(current);
                    }
                }, 20);
            });

            // Timestamp de atualização
            const now = new Date().toLocaleString('pt-BR');
            console.log('Relatório gerado em:', now);
        });
        `;
    }
}
