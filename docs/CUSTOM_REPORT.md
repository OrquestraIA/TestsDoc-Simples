# 📊 Relatórios Customizados

Este projeto gera relatórios customizados com dashboard interativo e estatísticas detalhadas dos testes E2E.

## 🎯 Características

### Dashboard Completo
- ✅ **Estatísticas visuais**: Total de testes, passou, falhou, ignorado
- 📈 **Taxa de sucesso**: Barra de progresso com percentual
- ⏱️ **Tempo de execução**: Duração total e por teste
- 👤 **Informações do executor**: Usuário, ferramenta, ambiente, browsers
- 📚 **Links para documentação**: Acesso direto aos casos de teste documentados
- 🎭 **Integração com Playwright**: Link para relatório completo do Playwright

### Navegação Inteligente
- **Por módulo**: Organiza testes por módulo (Autenticação, Documentos, Arquivo Físico)
- **Documentação contextual**: Mostra apenas documentação dos módulos testados
- **Resultados detalhados**: Tabelas com status, browser, duração e erros

### Design Responsivo
- Interface moderna e profissional
- Cores gradient (roxo/azul)
- Animações suaves nos contadores
- Totalmente responsivo (mobile-friendly)

## 🚀 Como Usar

### Geração Local

```bash
# Rodar testes e gerar relatório customizado
npm run test:with-report

# Por ambiente específico
npm run test:dev:report       # Gera em custom-report-dev/
npm run test:homolog:report   # Gera em custom-report-homolog/
npm run test:prod:report      # Gera em custom-report-prod/

# Apenas gerar relatório (sem rodar testes novamente)
npm run report:custom
```

### Geração no CI/CD

O relatório é gerado automaticamente após cada execução dos testes no GitHub Actions:

1. Execute o workflow manualmente ou via push
2. Aguarde a conclusão
3. Baixe os artefatos:
   - `custom-report-[browser]-[ambiente]` - Dashboard customizado
   - `playwright-report-[browser]-[ambiente]` - Relatório Playwright
   - `test-results-[browser]-[ambiente]` - Resultados JSON

## 📂 Estrutura do Relatório

```
custom-report-[ambiente]/
└── index.html              # Dashboard completo (auto-contido)
```

O arquivo HTML é **auto-contido** (CSS e JS inline), não precisa de arquivos externos.

## 🎨 Componentes do Dashboard

### 1. Header
- Título do dashboard
- Status geral (✅ sucesso / ❌ falhas)

### 2. Cards de Estatísticas
- **Total de Testes**: Quantidade total executada
- **Passou**: Testes bem-sucedidos
- **Falhou**: Testes com falhas
- **Ignorado**: Testes pulados
- **Taxa de Sucesso**: Barra de progresso visual
- **Tempo Total**: Duração da execução

### 3. Informações da Execução
- Executor (usuário)
- Ferramenta e versão (Playwright 1.40.0)
- Ambiente (DEV/HOMOLOG/PROD)
- Browsers testados
- Data/hora de início e fim

### 4. Documentação dos Testes
- Cards por módulo
- Indicação visual de módulos testados (✅)
- Links diretos para documentação markdown
- Contador de casos de teste por módulo

### 5. Resultados Detalhados
- Agrupados por arquivo de teste
- Tabela com:
  - Status visual (✅❌⏭️)
  - Nome do teste
  - Browser executado
  - Duração
  - Mensagem de erro (se houver)

### 6. Link para Playwright
- Botão destacado para relatório completo
- Acesso a traces, screenshots e vídeos

## 📊 Exemplo Visual

```
┌─────────────────────────────────────────┐
│  📊 Dashboard de Testes E2E             │
│  Doc+Simples - Relatório Customizado   │
│  ✅ Todos os testes passaram!           │
└─────────────────────────────────────────┘

┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│ 📝14 │ │ ✅12 │ │ ❌ 2 │ │ ⏭️ 0 │
│Total │ │Passou│ │Falhou│ │Ignor.│
└──────┘ └──────┘ └──────┘ └──────┘

┌─────────────────────────────────────────┐
│ 📈 Taxa de Sucesso                      │
│ ████████████████░░░░ 85.71%             │
└─────────────────────────────────────────┘

ℹ️ Informações da Execução
├─ 👤 Executor: marcelo_om30
├─ 🔧 Ferramenta: Playwright 1.40.0
├─ 🌍 Ambiente: HOMOLOG
└─ 🌐 Browsers: chromium firefox webkit

📚 Documentação dos Testes
┌─────────────┐ ┌─────────────┐
│✅Autenticação│ │📄Documentos  │
│4 casos      │ │2 casos      │
│📖 Ver Doc   │ │📖 Ver Doc   │
└─────────────┘ └─────────────┘
```

## 🔗 Integração com Documentação

O relatório detecta automaticamente quais módulos foram testados e:
- ✅ Destaca módulos testados com borda verde
- 📄 Mostra módulos não testados com borda cinza
- 📖 Fornece links diretos para a documentação ISO/IEC/IEEE 29119-3

## 🎯 Exemplo de Uso

### Teste específico
```bash
# Rodar apenas autenticação e gerar relatório
npm run test:homolog -- tests/auth.spec.ts && npm run report:custom
```

O relatório mostrará:
- 4 testes executados
- Apenas o card "Autenticação" destacado como testado
- Link para `docs/test-cases/authentication.md`
- Resultados detalhados apenas de auth

### Todos os testes
```bash
npm run test:homolog:report
```

O relatório mostrará:
- 14 testes executados
- Todos os 3 cards destacados como testados
- Links para todas as documentações
- Resultados agrupados por módulo

## 🌈 Customização

O arquivo `utils/report-generator.ts` pode ser customizado para:
- Adicionar novos módulos em `modulesDocs`
- Modificar cores no CSS
- Adicionar novas métricas
- Alterar o layout do dashboard

## 📌 Observações

- O relatório é gerado a partir dos arquivos JSON do Playwright
- Funciona offline (HTML auto-contido)
- Compatível com todos os browsers modernos
- Pode ser compartilhado facilmente (apenas 1 arquivo HTML)
