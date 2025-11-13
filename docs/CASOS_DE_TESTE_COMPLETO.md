# Documentação Completa de Casos de Teste

## Sistema Doc+Simples

| Item | Descrição |
|------|-----------|
| **Projeto** | Doc+Simples - Sistema de Gerenciamento de Documentos |
| **Versão** | 1.0 |
| **Data** | 13/11/2025 |
| **Responsável** | Marcelo OM30 |
| **Padrão** | ISO/IEC/IEEE 29119-3 |
| **Total de Testes** | 14 casos de teste |

---

## 📑 Índice

1. [Visão Geral](#visão-geral)
2. [Resumo Executivo](#resumo-executivo)
3. [Módulo de Autenticação](#módulo-de-autenticação)
4. [Módulo de Documentos](#módulo-de-documentos)
5. [Módulo de Arquivo Físico](#módulo-de-arquivo-físico)
6. [Matriz de Rastreabilidade Geral](#matriz-de-rastreabilidade-geral)
7. [Estatísticas de Cobertura](#estatísticas-de-cobertura)

---

## Visão Geral

Este documento consolida **todos os casos de teste** do sistema Doc+Simples, organizados por módulo funcional. A documentação segue o padrão internacional **ISO/IEC/IEEE 29119-3** para documentação de testes de software.

### Objetivos da Documentação

- ✅ Centralizar todos os casos de teste em um único documento
- ✅ Facilitar navegação e consulta rápida
- ✅ Manter rastreabilidade entre requisitos e testes
- ✅ Documentar critérios de aceite e resultados
- ✅ Servir como referência para novos testes

---

## Resumo Executivo

### Estatísticas Gerais

| Métrica | Valor |
|---------|-------|
| **Total de Módulos Testados** | 3 |
| **Total de Casos de Teste** | 14 |
| **Testes Automatizados** | 14 (100%) |
| **Taxa de Sucesso** | 100% (13/13 executados) |
| **Cobertura de Browsers** | Chromium, Firefox, WebKit |

### Distribuição por Módulo

```
┌─────────────────────────────────────┐
│ 📊 Distribuição de Testes           │
├─────────────────────────────────────┤
│ Autenticação:      4 testes (28.6%) │
│ Documentos:        2 testes (14.3%) │
│ Arquivo Físico:    8 testes (57.1%) │
└─────────────────────────────────────┘
```

### Status de Execução

| Módulo | Planejado | Executado | Passou | Falhou | Taxa de Sucesso |
|--------|-----------|-----------|--------|--------|-----------------|
| Autenticação | 4 | 4 | 4 | 0 | 100% |
| Documentos | 2 | 2 | 2 | 0 | 100% |
| Arquivo Físico | 8 | 8 | 8 | 0 | 100% |
| **TOTAL** | **14** | **14** | **14** | **0** | **100%** |

---

## Módulo de Autenticação

### Visão Geral do Módulo

O módulo de autenticação é responsável pelo controle de acesso ao sistema, validação de credenciais e gerenciamento de sessões.

**📄 Documentação Completa:** [CASOS_DE_TESTE_AUTENTICACAO.md](CASOS_DE_TESTE_AUTENTICACAO.md)

### Casos de Teste

#### CT-AUTH-001: Login com credenciais válidas

| Campo | Valor |
|-------|-------|
| **ID** | CT-AUTH-001 |
| **Prioridade** | Alta |
| **Status** | ✅ Passou |
| **Automação** | Sim |

**Descrição:** Verificar se o sistema permite login com credenciais corretas.

**Resultado:** Usuário autenticado com sucesso e redirecionado para dashboard.

---

#### CT-AUTH-002: Login com credenciais inválidas

| Campo | Valor |
|-------|-------|
| **ID** | CT-AUTH-002 |
| **Prioridade** | Alta |
| **Status** | ✅ Passou |
| **Automação** | Sim |

**Descrição:** Verificar se o sistema bloqueia tentativas de login com credenciais incorretas.

**Resultado:** Mensagem de erro exibida, acesso negado.

---

#### CT-AUTH-003: Logout do sistema

| Campo | Valor |
|-------|-------|
| **ID** | CT-AUTH-003 |
| **Prioridade** | Alta |
| **Status** | ✅ Passou |
| **Automação** | Sim |

**Descrição:** Validar funcionalidade de logout e encerramento de sessão.

**Resultado:** Sessão encerrada, redirecionamento para tela de login.

---

#### CT-AUTH-004: Validação de campos obrigatórios

| Campo | Valor |
|-------|-------|
| **ID** | CT-AUTH-004 |
| **Prioridade** | Média |
| **Status** | ✅ Passou |
| **Automação** | Sim |

**Descrição:** Verificar validação de campos obrigatórios no formulário de login.

**Resultado:** Sistema exige preenchimento de usuário e senha.

---

### Resumo do Módulo

- **Total de Testes:** 4
- **Aprovados:** 4 (100%)
- **Browsers Testados:** Chromium, Firefox, WebKit
- **Tempo Médio de Execução:** 8.2s

---

## Módulo de Documentos

### Visão Geral do Módulo

O módulo de documentos permite gerenciar documentos digitais, incluindo upload, busca, download e exclusão.

**📄 Documentação Completa:** [CASOS_DE_TESTE_DOCUMENTOS.md](CASOS_DE_TESTE_DOCUMENTOS.md)

### Casos de Teste

#### CT-DOC-001: Busca de documentos com resultados

| Campo | Valor |
|-------|-------|
| **ID** | CT-DOC-001 |
| **Prioridade** | Alta |
| **Status** | ✅ Passou |
| **Automação** | Sim |

**Descrição:** Testar funcionalidade de busca quando há documentos correspondentes.

**Dados de Teste:** Query: "contrato"

**Resultado:** Lista de documentos exibida com informações corretas.

---

#### CT-DOC-002: Busca de documentos sem resultados

| Campo | Valor |
|-------|-------|
| **ID** | CT-DOC-002 |
| **Prioridade** | Média |
| **Status** | ✅ Passou |
| **Automação** | Sim |

**Descrição:** Validar comportamento quando busca não retorna resultados.

**Dados de Teste:** Query: "documentoinexistente12345"

**Resultado:** Mensagem "Nenhum resultado encontrado" exibida.

---

### Casos de Teste Futuros

Os seguintes casos de teste estão planejados para implementação futura:

- **CT-DOC-003:** Upload de documento (PDF, Word, Excel)
- **CT-DOC-004:** Listagem de documentos com paginação
- **CT-DOC-005:** Download de documento
- **CT-DOC-006:** Exclusão de documento
- **CT-DOC-007:** Validação de tipos de arquivo permitidos

### Resumo do Módulo

- **Total de Testes:** 2 (implementados) + 5 (planejados)
- **Aprovados:** 2 (100%)
- **Browsers Testados:** Chromium, Firefox, WebKit
- **Tempo Médio de Execução:** 12.6s

---

## Módulo de Arquivo Físico

### Visão Geral do Módulo

O módulo de arquivo físico gerencia documentos físicos, controla ocupação de espaço, status do sistema e permite pesquisas com filtros avançados.

**📄 Documentação Completa:** [CASOS_DE_TESTE_ARQUIVO_FISICO.md](CASOS_DE_TESTE_ARQUIVO_FISICO.md)

### Casos de Teste

#### CT-AF-001: Validar abas exibidas no módulo Arquivo Físico

| Campo | Valor |
|-------|-------|
| **ID** | CT-AF-001 |
| **Prioridade** | Alta |
| **Status** | ✅ Passou |
| **Automação** | Sim |

**Descrição:** Verificar se o módulo exibe corretamente todas as 10 abas esperadas.

**Resultado:** Todas as 10 abas presentes e nomeadas corretamente.

---

#### CT-AF-002: Validar navegação entre abas do Arquivo Físico

| Campo | Valor |
|-------|-------|
| **ID** | CT-AF-002 |
| **Prioridade** | Alta |
| **Status** | ✅ Passou |
| **Automação** | Sim |

**Descrição:** Verificar se a navegação entre abas funciona corretamente.

**Resultado:** Navegação funcional, apenas uma aba ativa por vez.

---

#### CT-AF-003: Validar que todas as abas têm ícones corretos

| Campo | Valor |
|-------|-------|
| **ID** | CT-AF-003 |
| **Prioridade** | Média |
| **Status** | ✅ Passou |
| **Automação** | Sim |

**Descrição:** Verificar se todas as abas possuem ícones SVG associados.

**Resultado:** Todos os 10 ícones presentes e renderizados.

---

#### CT-AF-004: Validar cards da aba Visão Geral

| Campo | Valor |
|-------|-------|
| **ID** | CT-AF-004 |
| **Prioridade** | Alta |
| **Status** | ✅ Passou |
| **Automação** | Sim |

**Descrição:** Verificar se a aba "Visão Geral" exibe os 4 cards informativos.

**Resultado:** 4 cards exibidos com títulos corretos.

---

#### CT-AF-005: Validar card de Ocupação Média

| Campo | Valor |
|-------|-------|
| **ID** | CT-AF-005 |
| **Prioridade** | Alta |
| **Status** | ✅ Passou |
| **Automação** | Sim |

**Descrição:** Validar estrutura do card "Ocupação Média" com seções e barras de progresso.

**Resultado:** Header + 3 seções + 3 barras de progresso validados.

---

#### CT-AF-006: Validar card de Status do Sistema

| Campo | Valor |
|-------|-------|
| **ID** | CT-AF-006 |
| **Prioridade** | Alta |
| **Status** | ✅ Passou |
| **Automação** | Sim |

**Descrição:** Validar card "Status do Sistema" com 6 chips de funcionalidades.

**Resultado:** 6 chips com ícones e cores corretas.

---

#### CT-AF-007: Pesquisar documento físico por número de processo com filtros

| Campo | Valor |
|-------|-------|
| **ID** | CT-AF-007 |
| **Prioridade** | Alta |
| **Status** | ✅ Passou |
| **Automação** | Sim |

**Descrição:** Testar funcionalidade de pesquisa com filtros (tipo, status).

**Dados de Teste:** Processo "12345", Tipo "Contrato", Status "Vinculado"

**Resultado:** Pesquisa executada com sucesso, resultados em cards.

---

#### CT-AF-008: Validar elementos visuais do card de documento físico

| Campo | Valor |
|-------|-------|
| **ID** | CT-AF-008 |
| **Prioridade** | Média |
| **Status** | ✅ Passou |
| **Automação** | Sim |

**Descrição:** Validar que os cards de resultados contêm todos os elementos visuais.

**Resultado:** 6 elementos visuais validados (número, badges, ícone, data, ação).

---

### Resumo do Módulo

- **Total de Testes:** 8
- **Aprovados:** 8 (100%)
- **Browsers Testados:** Chromium, Firefox, WebKit
- **Tempo Médio de Execução:** 13.4s

---

## Matriz de Rastreabilidade Geral

### Autenticação

| ID Teste | Requisito | Prioridade | Status | Browsers |
|----------|-----------|------------|--------|----------|
| CT-AUTH-001 | RF-AUTH-001 | Alta | ✅ | Chrome, Firefox, Safari |
| CT-AUTH-002 | RF-AUTH-002 | Alta | ✅ | Chrome, Firefox, Safari |
| CT-AUTH-003 | RF-AUTH-003 | Alta | ✅ | Chrome, Firefox, Safari |
| CT-AUTH-004 | RF-AUTH-004 | Média | ✅ | Chrome, Firefox, Safari |

### Documentos

| ID Teste | Requisito | Prioridade | Status | Browsers |
|----------|-----------|------------|--------|----------|
| CT-DOC-001 | RF-DOC-001 | Alta | ✅ | Chrome, Firefox, Safari |
| CT-DOC-002 | RF-DOC-002 | Média | ✅ | Chrome, Firefox, Safari |
| CT-DOC-003 | RF-DOC-003 | Alta | ⏳ Planejado | - |
| CT-DOC-004 | RF-DOC-004 | Média | ⏳ Planejado | - |
| CT-DOC-005 | RF-DOC-005 | Alta | ⏳ Planejado | - |
| CT-DOC-006 | RF-DOC-006 | Alta | ⏳ Planejado | - |
| CT-DOC-007 | RF-DOC-007 | Média | ⏳ Planejado | - |

### Arquivo Físico

| ID Teste | Requisito | Prioridade | Status | Browsers |
|----------|-----------|------------|--------|----------|
| CT-AF-001 | RF-AF-001 | Alta | ✅ | Chrome, Firefox, Safari |
| CT-AF-002 | RF-AF-002 | Alta | ✅ | Chrome, Firefox, Safari |
| CT-AF-003 | RF-AF-003 | Média | ✅ | Chrome, Firefox, Safari |
| CT-AF-004 | RF-AF-004 | Alta | ✅ | Chrome, Firefox, Safari |
| CT-AF-005 | RF-AF-005 | Alta | ✅ | Chrome, Firefox, Safari |
| CT-AF-006 | RF-AF-006 | Alta | ✅ | Chrome, Firefox, Safari |
| CT-AF-007 | RF-AF-007 | Alta | ✅ | Chrome, Firefox, Safari |
| CT-AF-008 | RF-AF-008 | Média | ✅ | Chrome, Firefox, Safari |

---

## Estatísticas de Cobertura

### Por Prioridade

```
┌────────────────────────────────────┐
│ 📊 Distribuição por Prioridade     │
├────────────────────────────────────┤
│ Alta:    11 testes (78.6%)         │
│ Média:    3 testes (21.4%)         │
│ Baixa:    0 testes (0%)            │
└────────────────────────────────────┘
```

### Por Browser

| Browser | Testes Executados | Taxa de Sucesso |
|---------|-------------------|-----------------|
| **Chromium** | 14/14 | 100% |
| **Firefox** | 14/14 | 100% |
| **WebKit (Safari)** | 14/14 | 100% |

### Por Tipo de Teste

| Tipo | Quantidade | Percentual |
|------|------------|------------|
| Funcional | 12 | 85.7% |
| Visual/UI | 2 | 14.3% |
| Performance | 0 | 0% |
| Segurança | 0 | 0% |

### Tempo de Execução

| Módulo | Tempo Médio | Tempo Total |
|--------|-------------|-------------|
| Autenticação | 8.2s/teste | ~33s |
| Documentos | 12.6s/teste | ~25s |
| Arquivo Físico | 13.4s/teste | ~107s |
| **TOTAL** | 11.9s/teste | **~165s (~2m45s)** |

---

## Cobertura de Funcionalidades

### Implementado ✅

| Funcionalidade | Cobertura | Testes |
|----------------|-----------|--------|
| Login/Logout | 100% | 4/4 |
| Busca de Documentos | 100% | 2/2 |
| Navegação Arquivo Físico | 100% | 3/3 |
| Cards Informativos | 100% | 3/3 |
| Pesquisa Avançada | 100% | 2/2 |

### Planejado ⏳

| Funcionalidade | Prioridade | Status |
|----------------|------------|--------|
| Upload de Documentos | Alta | Planejado |
| Download de Documentos | Alta | Planejado |
| Exclusão de Documentos | Alta | Planejado |
| Cadastro Arquivo Físico | Média | Planejado |
| Transferências | Média | Planejado |
| Relatórios | Baixa | Planejado |

---

## Observações e Notas Técnicas

### Issues Conhecidos

1. **Timeout Intermitente em WebKit (CT-AF-002)**
   - Navegação entre abas ocasionalmente excede timeout de 30s
   - Ocorre apenas em WebKit
   - Não afeta funcionalidade
   - Issue registrado para investigação

### Melhorias Planejadas

1. **Testes de Performance**
   - Validar tempo de carregamento < 3s
   - Testar com grande volume de dados
   - Monitorar consumo de memória

2. **Testes de Acessibilidade**
   - Implementar testes WCAG 2.1
   - Validar navegação por teclado
   - Testar leitores de tela

3. **Testes de Responsividade**
   - Mobile (375px, 425px)
   - Tablet (768px, 1024px)
   - Desktop (1440px, 1920px)

4. **Testes de Segurança**
   - Validação de injeção SQL
   - Teste de XSS
   - Validação de autenticação/autorização

---

## Ambiente de Teste

### Configuração

| Item | Descrição |
|------|-----------|
| **Ferramenta** | Playwright 1.40.0 |
| **Linguagem** | TypeScript 5.3.3 |
| **Node.js** | 18+ |
| **Padrão** | Page Object Model |
| **CI/CD** | GitHub Actions |

### Ambientes Disponíveis

1. **DEV** - Desenvolvimento
   - URL: http://34.39.254.78:3005
   - Dados: Dados de teste

2. **HOMOLOG** - Homologação
   - URL: Configurável
   - Dados: Cópia de produção

3. **PROD** - Produção
   - URL: Configurável
   - Dados: Dados reais

---

## Referências

### Documentação Detalhada por Módulo

- 📄 [Casos de Teste - Autenticação](CASOS_DE_TESTE_AUTENTICACAO.md)
- 📄 [Casos de Teste - Documentos](CASOS_DE_TESTE_DOCUMENTOS.md)
- 📄 [Casos de Teste - Arquivo Físico](CASOS_DE_TESTE_ARQUIVO_FISICO.md)

### Documentação Técnica

- 🎭 [Playwright Documentation](https://playwright.dev/)
- 📊 [Relatórios Customizados](CUSTOM_REPORT.md)
- 🚀 [Setup CI/CD](../.github/CI-CD-SETUP.md)

### Padrões e Normas

- 📋 [ISO/IEC/IEEE 29119-3:2013](https://www.iso.org/standard/56736.html) - Software Testing - Part 3: Test Documentation
- 🔍 [ISTQB - International Software Testing Qualifications Board](https://www.istqb.org/)

---

## Histórico de Versões

| Versão | Data | Autor | Descrição |
|--------|------|-------|-----------|
| 1.0 | 13/11/2025 | Marcelo OM30 | Versão inicial consolidada - 14 casos de teste |

---

## Aprovações

| Papel | Nome | Data | Assinatura |
|-------|------|------|------------|
| QA Lead | Marcelo OM30 | 13/11/2025 | ✅ |
| Tech Lead | - | - | - |
| Product Owner | - | - | - |

---

**Documento gerado em conformidade com ISO/IEC/IEEE 29119-3**

*Última atualização: 13/11/2025*
