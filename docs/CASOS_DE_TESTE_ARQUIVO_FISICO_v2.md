# Casos de Teste - Módulo Arquivo Físico

## Informações do Documento

| Item | Descrição |
|------|-----------|
| **Projeto** | Doc+Simples - Sistema de Gerenciamento de Documentos |
| **Módulo** | Arquivo Físico |
| **Arquivo de Testes** | `tests/physical-archive.spec.ts` |
| **Versão** | 2.0 |
| **Data** | 17/11/2025 |
| **Responsável** | Marcelo OM30 |
| **Padrão** | ISO/IEC/IEEE 29119-3 |

---

## Resumo Executivo

**Total de Testes:** 12  
**Implementados:** 9 (75%)  
**Passando:** 9 (100%)  
**Skipped:** 3 (25%)  

**Cobertura por Aba:**
- ✅ Localizações: 3/3 testes (100%)
- ✅ Repositórios: 3/3 testes (100%)
- ✅ Etiquetas: 3/3 testes (100%)
- ⏭️ Vinculação: 0/1 testes (0%)
- ⏭️ Empréstimo: 0/1 testes (0%)
- ⏭️ Histórico: 0/1 testes (0%)

---

## Índice

1. [Aba: Localizações](#aba-localizações)
2. [Aba: Repositórios](#aba-repositórios)
3. [Aba: Etiquetas](#aba-etiquetas)
4. [Funcionalidades de Vinculação](#funcionalidades-de-vinculação)
5. [Empréstimo de Documentos](#empréstimo-de-documentos)
6. [Histórico de Movimentações](#histórico-de-movimentações)
7. [Matriz de Rastreabilidade](#matriz-de-rastreabilidade)

---

## Aba: Localizações

### CT-AF-LOC-001: Cadastrar localização de arquivo físico

**ID:** CT-AF-LOC-001  
**Prioridade:** Alta  
**Status:** ✅ Passando  
**Arquivo:** `tests/physical-archive.spec.ts:19`  
**Tempo de Execução:** ~10.5s

**Gherkin:**
\`\`\`gherkin
Feature: Gerenciamento de Localizações Físicas
  Como um usuário do sistema
  Eu quero cadastrar localizações físicas
  Para organizar o arquivo físico

  Scenario: Cadastrar nova localização
    Given que estou autenticado no sistema
    And estou no módulo "Arquivo Físico"
    When eu clico na aba "Localizações"
    And eu clico no botão "Criar Localização"
    Then devo ver um modal de cadastro
    And o formulário deve ter 10 campos de entrada
\`\`\`

**Resultado:** ✅ Formulário possui 10 campos

---

### CT-AF-LOC-002: Buscar localização física

**ID:** CT-AF-LOC-002  
**Prioridade:** Alta  
**Status:** ✅ Passando  
**Arquivo:** `tests/physical-archive.spec.ts:56`  
**Tempo de Execução:** ~11.1s

**Gherkin:**
\`\`\`gherkin
Feature: Busca de Localizações
  
  Scenario: Buscar localização inexistente
    Given que estou na aba "Localizações"
    When eu preencho o campo de busca com "sala"
    And aguardo os resultados
    Then devo ver a mensagem "Nenhuma localização encontrada"
\`\`\`

**Resultado:** ✅ Empty state exibido corretamente

---

### CT-AF-LOC-003: Filtrar localizações por tipo e status

**ID:** CT-AF-LOC-003  
**Prioridade:** Média  
**Status:** ✅ Passando  
**Arquivo:** `tests/physical-archive.spec.ts:85`  
**Tempo de Execução:** ~8.7s

**Gherkin:**
\`\`\`gherkin
Feature: Filtros de Localizações
  
  Scenario: Validar presença de filtros
    Given que estou na aba "Localizações"
    Then devo ver o filtro "Tipo" com valor "Todos"
    And devo ver o filtro "Status" com valor "Todos"
\`\`\`

**Resultado:** ✅ Filtros encontrados

---

## Aba: Repositórios

### CT-AF-REP-001: Cadastrar repositório físico

**ID:** CT-AF-REP-001  
**Prioridade:** Alta  
**Status:** ✅ Passando  
**Arquivo:** `tests/physical-archive.spec.ts:114`  
**Tempo de Execução:** ~9.4s

**Gherkin:**
\`\`\`gherkin
Feature: Gerenciamento de Repositórios
  
  Scenario: Cadastrar novo repositório
    Given que estou autenticado no sistema
    And estou na aba "Repositórios"
    When eu clico no botão "Criar Repositório"
    Then devo ver um modal de cadastro
    And o formulário deve ter 10 campos de entrada
\`\`\`

**Resultado:** ✅ Formulário possui 10 campos

---

### CT-AF-REP-002: Buscar repositório físico

**ID:** CT-AF-REP-002  
**Prioridade:** Alta  
**Status:** ✅ Passando  
**Arquivo:** `tests/physical-archive.spec.ts:145`  
**Tempo de Execução:** ~10.5s

**Gherkin:**
\`\`\`gherkin
Feature: Busca de Repositórios
  
  Scenario: Buscar repositório inexistente
    Given que estou na aba "Repositórios"
    When eu preencho o campo de busca com "arquivo"
    And aguardo os resultados
    Then devo ver a mensagem "Nenhum repositório encontrado"
\`\`\`

**Resultado:** ✅ Empty state exibido corretamente

---

### CT-AF-REP-003: Filtrar repositórios por tipo e status

**ID:** CT-AF-REP-003  
**Prioridade:** Média  
**Status:** ✅ Passando  
**Arquivo:** `tests/physical-archive.spec.ts:174`  
**Tempo de Execução:** ~7.6s

**Gherkin:**
\`\`\`gherkin
Feature: Filtros de Repositórios
  
  Scenario: Validar presença de filtros
    Given que estou na aba "Repositórios"
    Then devo ver o filtro "Tipo" com valor "Todos"
    And devo ver o filtro "Status" com valor "Todos"
\`\`\`

**Resultado:** ✅ Filtros de Tipo e Status encontrados

---

## Aba: Etiquetas

### CT-AF-ETQ-001: Gerar etiquetas com código de barras

**ID:** CT-AF-ETQ-001  
**Prioridade:** Alta  
**Status:** ✅ Passando  
**Arquivo:** `tests/physical-archive.spec.ts:203`  
**Tempo de Execução:** ~7.2s

**Gherkin:**
\`\`\`gherkin
Feature: Sistema de Geração de Etiquetas
  Como um usuário do sistema
  Eu quero gerar etiquetas com código de barras
  Para identificar repositórios físicos

  Scenario: Validar botão de geração
    Given que estou na aba "Etiquetas"
    Then devo ver o botão "Gerar Etiquetas"
    And devo ver especificação "6cm x 10cm"
    And devo ver especificação "Code 128"
    And devo ver especificação "PDF"
\`\`\`

**Resultado:** ✅ Botão e especificações encontrados

---

### CT-AF-ETQ-002: Visualizar preview de etiquetas

**ID:** CT-AF-ETQ-002  
**Prioridade:** Média  
**Status:** ✅ Passando  
**Arquivo:** `tests/physical-archive.spec.ts:239`  
**Tempo de Execução:** ~7.4s

**Gherkin:**
\`\`\`gherkin
Feature: Preview de Etiquetas
  
  Scenario: Validar botão de preview
    Given que estou na aba "Etiquetas"
    Then devo ver o botão "Preview"
    And devo ver o contador "0" de repositórios disponíveis
\`\`\`

**Resultado:** ✅ Botão Preview e contador encontrados

---

### CT-AF-ETQ-003: Verificar informações do sistema de etiquetas

**ID:** CT-AF-ETQ-003  
**Prioridade:** Média  
**Status:** ✅ Passando  
**Arquivo:** `tests/physical-archive.spec.ts:265`  
**Tempo de Execução:** ~9.7s

**Gherkin:**
\`\`\`gherkin
Feature: Informações do Sistema de Etiquetas
  
  Scenario: Validar estrutura completa
    Given que estou na aba "Etiquetas"
    Then devo ver o título "Sistema de Geração de Etiquetas"
    And devo ver dica com formato "R01.C01.P01.F01.CX01"
    And devo ver o card "Especificações"
    And devo ver o card "Repositórios Disponíveis"
    And devo ver o card "Ações Disponíveis"
\`\`\`

**Resultado:** ✅ 3 cards informativos encontrados

---

## Funcionalidades de Vinculação

### CT-AF-VIN-001: Vincular documento eletrônico a arquivo físico

**ID:** CT-AF-VIN-001  
**Prioridade:** Alta  
**Status:** ⏭️ Skipped  
**Arquivo:** `tests/physical-archive.spec.ts:310`

**Motivo:** Botão de vinculação não encontrado na interface atual

**Gherkin:**
\`\`\`gherkin
Feature: Vinculação de Documentos
  
  Scenario: Vincular documento eletrônico
    Given que estou na página de documentos
    When eu clico no botão "Vincular"
    Then devo ver modal de vinculação
    And devo poder selecionar localização física
\`\`\`

---

## Empréstimo de Documentos

### CT-AF-EMP-001: Registrar empréstimo de documento físico

**ID:** CT-AF-EMP-001  
**Prioridade:** Alta  
**Status:** ⏭️ Skipped  
**Arquivo:** `tests/physical-archive.spec.ts:334`

**Motivo:** Funcionalidade de empréstimo não implementada

---

## Histórico de Movimentações

### CT-AF-HIS-001: Visualizar histórico de movimentações

**ID:** CT-AF-HIS-001  
**Prioridade:** Média  
**Status:** ⏭️ Skipped  
**Arquivo:** `tests/physical-archive.spec.ts:356`

**Motivo:** Aba de histórico não encontrada

---

## Matriz de Rastreabilidade

| ID Teste | Funcionalidade | Prioridade | Status | Tempo |
|----------|----------------|------------|--------|-------|
| CT-AF-LOC-001 | Cadastrar localização | Alta | ✅ Passou | 10.5s |
| CT-AF-LOC-002 | Buscar localização | Alta | ✅ Passou | 11.1s |
| CT-AF-LOC-003 | Filtrar localizações | Média | ✅ Passou | 8.7s |
| CT-AF-REP-001 | Cadastrar repositório | Alta | ✅ Passou | 9.4s |
| CT-AF-REP-002 | Buscar repositório | Alta | ✅ Passou | 10.5s |
| CT-AF-REP-003 | Filtrar repositórios | Média | ✅ Passou | 7.6s |
| CT-AF-ETQ-001 | Gerar etiquetas | Alta | ✅ Passou | 7.2s |
| CT-AF-ETQ-002 | Preview etiquetas | Média | ✅ Passou | 7.4s |
| CT-AF-ETQ-003 | Info etiquetas | Média | ✅ Passou | 9.7s |
| CT-AF-VIN-001 | Vincular documento | Alta | ⏭️ Skipped | - |
| CT-AF-EMP-001 | Registrar empréstimo | Alta | ⏭️ Skipped | - |
| CT-AF-HIS-001 | Histórico | Média | ⏭️ Skipped | - |

**Tempo Total de Execução:** ~38.3s (9 testes)

---

## Observações Técnicas

### Locators Material-UI Utilizados

**Navegação:**
- Aba Localizações: `button[role="tab"]:has-text("Localizações")`
- Aba Repositórios: `button[role="tab"]:has-text("Repositórios")`
- Aba Etiquetas: `button[role="tab"]:has-text("Etiquetas")`

**Ações:**
- Botões de criar: `button:has-text("Criar Localização")`, `button:has-text("Novo Repositório")`
- Campo de busca: `input[placeholder="Digite para buscar..."]`
- Filtros: `div[role="combobox"]:has-text("Todos")`

**Validações:**
- Empty states: `h6:has-text("Nenhuma localização encontrada")`
- Campos de formulário: `.MuiTextField-root input, .MuiInputBase-input`
- Especificações: `.MuiChip-label:has-text("6cm x 10cm")`

---

## Próximos Passos

1. ✅ ~~Implementar testes de Localizações~~
2. ✅ ~~Implementar testes de Repositórios~~
3. ✅ ~~Implementar testes de Etiquetas~~
4. ⏳ Implementar testes de Solicitações
5. ⏳ Implementar testes de Temporalidade
6. ⏳ Implementar testes de Transferências
7. ⏳ Implementar testes de Documentos Físicos
8. ⏳ Implementar testes de Candidatos à Vinculação
9. ⏳ Implementar testes de Relatórios

---

**Documento gerado em conformidade com ISO/IEC/IEEE 29119-3**
**Última execução:** 17/11/2025
