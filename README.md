# Testes Automatizados - Doc+Simples

![Playwright Tests](https://github.com/OrquestralA/doc-simples-tests/actions/workflows/playwright-tests.yml/badge.svg)

Testes E2E automatizados com Playwright + TypeScript para aplicação Doc+Simples. Cobertura completa dos módulos de autenticação, documentos e arquivo físico com CI/CD via GitHub Actions.

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

## 🚀 Instalação

1. Instalar dependências:
```bash
npm install
```

2. Instalar browsers do Playwright:
```bash
npx playwright install
```

3. Configurar variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` se necessário para ajustar credenciais ou URL.

## 🏗️ Estrutura do Projeto

```
doc+simples_tests/
├── config/                  # Configurações
│   └── environment.ts      # Gerenciamento de ambientes (dev/homolog/prod)
├── pages/                   # Page Objects
│   ├── LoginPage.ts        # Página de login
│   └── DocumentsPage.ts    # Página de documentos
├── tests/                  # Arquivos de teste
│   ├── auth.spec.ts       # Testes de autenticação
│   ├── documents.spec.ts  # Testes de gerenciamento de documentos
│   └── ui.spec.ts         # Testes de interface
├── fixtures/               # Fixtures customizadas
│   └── authFixtures.ts    # Fixtures de autenticação
├── utils/                  # Utilitários
│   ├── helpers.ts         # Funções auxiliares
│   └── constants.ts       # Constantes e dados de teste
├── test-data/             # Arquivos para testes
│   └── sample.txt         # Arquivo de exemplo
├── .env                   # Variáveis de ambiente (não commitar)
├── .env.dev              # Configuração ambiente DEV
├── .env.homolog          # Configuração ambiente HOMOLOG
├── .env.prod             # Configuração ambiente PROD
├── .env.example          # Exemplo de variáveis de ambiente
├── .gitignore            # Arquivos ignorados pelo git
├── playwright.config.ts   # Configuração do Playwright
├── package.json          # Dependências do projeto
└── README.md            # Este arquivo
```

## 🧪 Executando os Testes

### Executar todos os testes (headless):
```bash
npm test
```

### Executar testes com interface gráfica:
```bash
npm run test:headed
```

### Executar testes no modo UI do Playwright:
```bash
npm run test:ui
```

### Executar testes em modo debug:
```bash
npm run test:debug
```

### Executar testes em um browser específico:
```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### 🌍 Executar testes por ambiente:

#### Ambiente DEV:
```bash
npm run test:dev           # Testes em DEV (headless)
npm run test:dev:ui        # Testes em DEV (modo UI)
```

#### Ambiente HOMOLOG:
```bash
npm run test:homolog       # Testes em HOMOLOG (headless)
npm run test:homolog:ui    # Testes em HOMOLOG (modo UI)
```

#### Ambiente PROD:
```bash
npm run test:prod          # Testes em PROD (headless)
npm run test:prod:ui       # Testes em PROD (modo UI)
```

### Ver relatório dos testes:
```bash
npm run test:report
```

## 📝 Page Objects

### LoginPage
- `navigate()`: Navega para a página de login
- `login(username, password)`: Realiza login
- `isLoggedIn()`: Verifica se está logado

### DocumentsPage
- `uploadDocument(filePath)`: Faz upload de documento
- `searchDocument(query)`: Busca documento
- `deleteDocument(documentName)`: Exclui documento
- `downloadDocument(documentName)`: Baixa documento
- `getDocumentsList()`: Lista documentos

## 🔧 Configuração

### Ambientes Disponíveis
O projeto suporta três ambientes distintos:
- **DEV**: Ambiente de desenvolvimento
- **HOMOLOG**: Ambiente de homologação
- **PROD**: Ambiente de produção

### Variáveis de Ambiente

Cada ambiente possui seu próprio arquivo de configuração:

#### .env.dev (Desenvolvimento)
```bash
ENVIRONMENT=dev
DEV_BASE_URL=http://34.39.254.78:3005
DEV_USERNAME=Administrator
DEV_PASSWORD=Administrator
```

#### .env.homolog (Homologação)
```bash
ENVIRONMENT=homolog
HOMOLOG_BASE_URL=<URL_DA_HOMOLOG>
HOMOLOG_USERNAME=Administrator
HOMOLOG_PASSWORD=Administrator
```

#### .env.prod (Produção)
```bash
ENVIRONMENT=prod
PROD_BASE_URL=<URL_DA_PRODUCAO>
PROD_USERNAME=Administrator
PROD_PASSWORD=Administrator
ACTION_TIMEOUT=15000
NAVIGATION_TIMEOUT=45000
```

### Gerenciamento de Ambientes

O arquivo `config/environment.ts` gerencia automaticamente as configurações baseado no ambiente selecionado:
- Determina a URL base correta
- Carrega as credenciais apropriadas
- Configura timeouts específicos por ambiente

### Como Adicionar URLs dos Ambientes

Quando a infraestrutura liberar as URLs de HOMOLOG e PROD, basta editar os arquivos:
- `.env.homolog`: Adicionar `HOMOLOG_BASE_URL`
- `.env.prod`: Adicionar `PROD_BASE_URL`

### Playwright Config
- Configurado para rodar em Chromium, Firefox e WebKit
- Suporte a mobile (Chrome e Safari)
- Screenshots em falhas
- Vídeos mantidos apenas em falhas
- Trace habilitado no primeiro retry

## 📊 Relatórios

Após executar os testes, os relatórios são gerados em:
- `playwright-report/`: Relatório HTML
- `test-results/`: Resultados em JSON

## 🎯 Próximos Passos

1. Analisar a aplicação para identificar seletores corretos
2. Implementar os métodos dos Page Objects
3. Implementar os casos de teste
4. Adicionar mais cenários de teste conforme necessário
5. Configurar CI/CD para execução automática

## 📊 Cobertura Atual

### Módulos Testados:
- ✅ **Autenticação** (4 testes) - Login, logout, validações
- ✅ **Documentos** (2 testes) - Busca com/sem resultados
- ✅ **Arquivo Físico** (8 testes) - Abas, cards, pesquisa de documentos físicos

**Total: 14 testes implementados e funcionando**

## 🚀 CI/CD com GitHub Actions

O projeto está configurado para executar testes automaticamente via GitHub Actions:

### Quando executa:
- ✅ Push para `main` ou `develop`
- ✅ Pull Requests
- ✅ Execução manual (escolhe ambiente)

### Browsers testados:
- Chromium, Firefox, WebKit (em paralelo)

### Artefatos gerados:
- Relatórios HTML interativos
- Screenshots e vídeos de falhas
- Resultados JSON

📖 **Documentação completa:** [CI-CD-SETUP.md](.github/CI-CD-SETUP.md)

## 🔐 Configuração de Secrets

Para rodar no GitHub Actions, configure os secrets no repositório:
- `DEV_BASE_URL`, `DEV_USERNAME`, `DEV_PASSWORD`
- `HOMOLOG_BASE_URL`, `HOMOLOG_USERNAME`, `HOMOLOG_PASSWORD`
- `PROD_BASE_URL`, `PROD_USERNAME`, `PROD_PASSWORD`

## 📚 Documentação Adicional

- [Casos de Teste ISO 29119-3](docs/CASOS_DE_TESTE.md)
- [Setup CI/CD](.github/CI-CD-SETUP.md)
- [Playwright Documentation](https://playwright.dev/)

## 👥 Time

**QA Engineer:** Marcelo OM30

---

**Última atualização:** 13/11/2025
