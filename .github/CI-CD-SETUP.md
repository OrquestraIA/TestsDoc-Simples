# Configuração de CI/CD - Testes Playwright com GitHub Actions

## 📋 Pré-requisitos

1. Repositório no GitHub
2. Acesso ao repositório para configurar Secrets
3. Aplicação rodando nos ambientes DEV, HOMOLOG e PROD

## 🔧 Passo a Passo de Configuração

### 1. Configurar Secrets no GitHub

Acesse: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

#### Secrets para DEV:
- `DEV_BASE_URL` = `http://34.39.254.78:3005`
- `DEV_USERNAME` = `Administrator`
- `DEV_PASSWORD` = `Administrator`

#### Secrets para HOMOLOG:
- `HOMOLOG_BASE_URL` = `http://seu-servidor-homolog:porta`
- `HOMOLOG_USERNAME` = `seu-usuario-homolog`
- `HOMOLOG_PASSWORD` = `sua-senha-homolog`

#### Secrets para PROD:
- `PROD_BASE_URL` = `http://seu-servidor-prod:porta`
- `PROD_USERNAME` = `seu-usuario-prod`
- `PROD_PASSWORD` = `sua-senha-prod`

### 2. Estrutura de Arquivos

```
.github/
└── workflows/
    └── playwright-tests.yml   # Pipeline principal
```

### 3. Como o Pipeline Funciona

#### Triggers (quando executa):
- ✅ **Push** para branches `main` ou `develop`
- ✅ **Pull Request** para branches `main` ou `develop`
- ✅ **Manual** via botão "Run workflow" (permite escolher ambiente)

#### Matriz de Testes:
O pipeline executa testes em **paralelo** nos 3 browsers:
- Chromium
- Firefox
- WebKit

#### Fluxo de Execução:
1. Checkout do código
2. Setup Node.js 18
3. Instalação de dependências (`npm ci`)
4. Instalação dos browsers do Playwright
5. Criação de arquivo `.env` com secrets do ambiente
6. Execução dos testes
7. Upload de relatórios, screenshots e vídeos

### 4. Executar Manualmente

1. Vá em **Actions** no GitHub
2. Selecione **Playwright Tests**
3. Clique em **Run workflow**
4. Escolha o ambiente (dev/homolog/prod)
5. Clique em **Run workflow**

### 5. Artefatos Gerados

Após execução, você terá acesso a:

- **playwright-report-{browser}-{env}**: Relatório HTML interativo
- **test-results-{browser}-{env}**: Resultados JSON
- **test-failures-{browser}-{env}**: Screenshots e vídeos de falhas (somente se houver falhas)

Retention: **30 dias**

### 6. Visualizar Resultados

#### No GitHub:
1. Entre na execução do workflow
2. Vá em **Summary**
3. Role até **Artifacts**
4. Baixe o relatório desejado
5. Extraia o ZIP
6. Abra `index.html` no navegador

#### Resumo no GitHub:
O pipeline gera automaticamente um resumo com:
- 📊 Ambiente testado
- 🌿 Branch
- 💾 Commit SHA
- ✅ Browsers testados

### 7. Notificações de Falha

Você pode adicionar notificações (Slack, Discord, Email) adicionando steps no final do workflow.

Exemplo para Slack:
```yaml
- name: Notificar Slack
  if: failure()
  uses: slackapi/slack-github-action@v1.24.0
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "❌ Testes falharam no ambiente ${{ github.event.inputs.environment }}"
      }
```

### 8. Badge no README

Adicione um badge no README.md do projeto:

```markdown
![Playwright Tests](https://github.com/SEU_USUARIO/SEU_REPO/actions/workflows/playwright-tests.yml/badge.svg)
```

### 9. Otimizações Opcionais

#### Cache de dependências npm (já configurado):
```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'
```

#### Executar apenas testes modificados:
Adicione `--only-changed` nos comandos de teste

#### Paralelização:
O workflow já está configurado para executar os 3 browsers em paralelo

### 10. Comandos Úteis Localmente

Para testar localmente antes de fazer push:

```bash
# Rodar testes como o CI faria
npm ci
npx playwright install --with-deps
npm run test:dev -- --project=chromium

# Ver relatório
npx playwright show-report playwright-report-dev
```

## 🚨 Troubleshooting

### Erro: "Missing dependencies"
- Solução: Certifique-se que `npx playwright install --with-deps` está no workflow

### Erro: "Base URL not defined"
- Solução: Verifique se os secrets estão configurados corretamente

### Testes passam local mas falham no CI
- Causa comum: Timeouts muito curtos
- Solução: Aumente `ACTION_TIMEOUT` e `NAVIGATION_TIMEOUT` nos secrets

### Artefatos muito grandes
- Solução: Reduza `retention-days` de 30 para 7 dias
- Solução: Use `video: 'retain-on-failure'` no playwright.config.ts

## 📚 Referências

- [Playwright CI Documentation](https://playwright.dev/docs/ci)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
