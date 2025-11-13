# Especificação de Casos de Teste - Módulo de Documentos

**Baseado em:** ISO/IEC/IEEE 29119-3 (Software Testing - Test Documentation)  
**Projeto:** Sistema de Gerenciamento de Documentos Doc+Simples  
**Módulo:** Gerenciamento de Documentos  
**Data:** Novembro 2025  
**Versão:** 1.0

---

## Índice

1. [Escopo do Módulo](#1-escopo-do-módulo)
2. [Casos de Teste Implementados](#2-casos-de-teste-implementados)
3. [Casos de Teste Pendentes](#3-casos-de-teste-pendentes)
4. [Matriz de Rastreabilidade](#4-matriz-de-rastreabilidade)
5. [Estatísticas](#5-estatísticas)

---

## 1. Escopo do Módulo

### 1.1. Objetivo
Validar as funcionalidades de gestão de documentos do sistema Doc+Simples, incluindo:
- Busca e filtros de documentos
- Upload de documentos
- Listagem e visualização
- Download de documentos
- Exclusão de documentos
- Validações de segurança

### 1.2. Pré-requisitos Gerais
- Usuário autenticado no sistema
- Acesso ao módulo de documentos
- Permissões adequadas para operações

---

## 2. Casos de Teste Implementados

### CT-DOC-003: Busca de Documentos com Resultados

**Objetivo:** Verificar se a funcionalidade de busca retorna resultados corretos quando documentos correspondem aos critérios.

**Prioridade:** Alta  
**Tipo:** Funcional  
**Status:** ✅ Implementado  
**Arquivo:** `tests/documents.spec.ts:33`

**Pré-condições:**
- Usuário autenticado no sistema
- Ao menos um documento cadastrado com número "2058 2013"
- Documento do tipo "Processo Municipal"
- Acesso à página de documentos

**Dados de Teste:**
- **Termo de busca:** 2058 2013
- **Tipo de documento:** Processo Municipal
- **Documento esperado:**
  - Título: 2058 2013
  - Tipo: ProcessoMunicipal
  - Usuário: Administrator
  - Tamanho: 497.52 KB
  - Data: Formato dd/mm/yyyy

**Gherkin:**
```gherkin
Feature: Busca de Documentos
  Como um usuário autenticado
  Eu quero buscar documentos por número e tipo
  Para encontrar rapidamente o documento desejado

  Background:
    Given que estou autenticado no sistema
    And estou na página de documentos
    And existem documentos cadastrados

  Scenario: Busca bem-sucedida com resultados
    When eu preencho o campo de busca com "2058 2013"
    And eu seleciono "Processo Municipal" no filtro de tipo
    And aguardo os resultados carregarem
    Then devo ver o documento "2058 2013" nos resultados
    And o documento deve ter o tipo "ProcessoMunicipal"
    And o documento deve mostrar o usuário "Administrator"
    And o documento deve mostrar o tamanho "497.52 KB"
    And o documento deve mostrar a data no formato "dd/mm/yyyy hh:mm"
```

**Passos de Execução:**
1. Autenticar no sistema com credenciais válidas
2. Navegar para a página de documentos
3. Aguardar carregamento completo da página
4. Verificar visibilidade do campo de busca
5. Verificar visibilidade do seletor de tipo de documento
6. Preencher o campo "Pesquisar documentos..." com "2058 2013"
7. Aguardar 1 segundo para processamento
8. Clicar no seletor de tipo de documento (combobox)
9. Aguardar menu dropdown aparecer (500ms)
10. Selecionar opção "Processo Municipal"
11. Aguardar processamento da filtragem (1 segundo)
12. Aguardar resultados (2 segundos)
13. Verificar se documento aparece nos resultados

**Resultado Esperado:**
- ✅ Campo de busca visível e funcional
- ✅ Seletor de tipo visível e funcional
- ✅ Documento "2058 2013" encontrado
- ✅ Card do documento exibido corretamente
- ✅ Informações validadas:
  - Título: "2058 2013"
  - Tipo: "ProcessoMunicipal"
  - Usuário: "Administrator"
  - Tamanho: "497.52 KB"
  - Data: Formato válido (dd/mm/yyyy)
- ✅ Ícones corretos exibidos (documento, calendário, usuário, storage)

**Critérios de Aceitação:**
- Busca retorna resultado em menos de 3 segundos
- Informações do documento são precisas
- Interface responsiva durante busca
- Filtros aplicados corretamente

**Evidências:**
- Screenshot do resultado da busca
- Log de execução do teste
- Tempo de resposta registrado

---

### CT-DOC-003-NEG: Busca de Documentos sem Resultados

**Objetivo:** Verificar se o sistema exibe mensagem apropriada quando nenhum documento corresponde aos critérios de busca.

**Prioridade:** Alta  
**Tipo:** Funcional - Negativo  
**Status:** ✅ Implementado  
**Arquivo:** `tests/documents.spec.ts:58`

**Pré-condições:**
- Usuário autenticado no sistema
- Acesso à página de documentos
- Termo de busca que não corresponde a nenhum documento

**Dados de Teste:**
- **Termo de busca:** 9999 9999 (documento inexistente)
- **Tipo de documento:** Processo Municipal
- **Resultado esperado:** Mensagem "Nenhum documento encontrado"

**Gherkin:**
```gherkin
Feature: Busca de Documentos
  
  Scenario: Busca sem resultados
    Given que estou autenticado no sistema
    And estou na página de documentos
    When eu preencho o campo de busca com "9999 9999"
    And eu seleciono "Processo Municipal" no filtro de tipo
    And aguardo os resultados carregarem
    Then devo ver a mensagem "Nenhum documento encontrado"
    And nenhum card de documento deve ser exibido
    And o documento "9999 9999" não deve existir nos resultados
```

**Passos de Execução:**
1. Autenticar no sistema com credenciais válidas
2. Navegar para a página de documentos
3. Aguardar carregamento completo
4. Verificar visibilidade dos campos de busca e filtro
5. Preencher campo de busca com "9999 9999"
6. Aguardar 1 segundo para processamento
7. Selecionar "Processo Municipal" no filtro
8. Aguardar processamento (1 segundo)
9. Aguardar resultados (2 segundos)
10. Verificar mensagem de "Nenhum documento encontrado"
11. Verificar ausência de cards de documentos

**Resultado Esperado:**
- ✅ Mensagem "Nenhum documento encontrado" visível
- ✅ Elemento h6 com classe MuiTypography-h6 exibido
- ✅ Nenhum card de documento visível
- ✅ Método verifyDocumentExists retorna false
- ✅ Interface clara sobre ausência de resultados

**Critérios de Aceitação:**
- Mensagem exibida em menos de 3 segundos
- Texto da mensagem claro e objetivo
- Sem erros no console
- Possibilidade de fazer nova busca

**Cenários Adicionais (Futuros):**
- Busca com campo vazio
- Busca com caracteres especiais
- Busca com apenas espaços
- Sugestões de busca alternativa

---

## 3. Casos de Teste Pendentes

### CT-DOC-001: Upload de Documento

**Objetivo:** Verificar se o sistema permite upload de documentos válidos.

**Prioridade:** Alta  
**Tipo:** Funcional  
**Status:** ⏳ Pendente Implementação  
**Arquivo:** `tests/documents.spec.ts:26`

**Dados de Teste:**
- **Arquivo:** sample.txt (text/plain)
- **Tamanho:** < 10MB
- **Localização:** `test-data/sample.txt`

**Gherkin:**
```gherkin
Feature: Upload de Documentos
  Como um usuário autenticado
  Eu quero fazer upload de documentos
  Para armazená-los no sistema

  Scenario: Upload bem-sucedido de arquivo válido
    Given que estou autenticado no sistema
    And estou na página de documentos
    When eu clico no botão "Upload"
    And eu seleciono o arquivo "sample.txt"
    And eu preencho os metadados necessários
    And eu confirmo o upload
    Then devo ver uma mensagem de sucesso
    And o documento deve aparecer na lista
    And as informações do documento devem estar corretas
```

**Passos Planejados:**
1. Autenticar no sistema
2. Navegar para página de documentos
3. Localizar e clicar no botão "Upload"
4. Abrir modal/dialog de upload
5. Selecionar arquivo do diretório test-data
6. Preencher campos obrigatórios (tipo, descrição, etc.)
7. Confirmar upload
8. Aguardar processamento
9. Verificar mensagem de sucesso
10. Verificar documento na listagem

**Resultado Esperado:**
- Upload processado com sucesso
- Documento visível na lista
- Metadados corretos
- Tamanho calculado corretamente

---

### CT-DOC-002: Listagem de Documentos

**Objetivo:** Verificar se o sistema exibe corretamente a lista de documentos cadastrados.

**Prioridade:** Alta  
**Tipo:** Funcional  
**Status:** ⏳ Pendente Implementação  
**Arquivo:** `tests/documents.spec.ts:30`

**Gherkin:**
```gherkin
Feature: Listagem de Documentos
  
  Scenario: Visualização da lista completa
    Given que estou autenticado no sistema
    And existem múltiplos documentos cadastrados
    When eu acesso a página de documentos
    Then devo ver todos os documentos em cards
    And cada card deve exibir título, tipo, data, usuário e tamanho
    And a lista deve estar ordenada por data (mais recente primeiro)
    And deve haver paginação se necessário
```

**Validações Planejadas:**
- Total de documentos correto
- Ordenação por data
- Informações completas em cada card
- Paginação funcional
- Performance de carregamento

---

### CT-DOC-004: Download de Documento

**Objetivo:** Verificar se o usuário consegue baixar documentos armazenados.

**Prioridade:** Alta  
**Tipo:** Funcional  
**Status:** ⏳ Pendente Implementação  
**Arquivo:** `tests/documents.spec.ts:80`

**Gherkin:**
```gherkin
Feature: Download de Documentos
  
  Scenario: Download bem-sucedido
    Given que estou autenticado no sistema
    And estou visualizando um documento específico
    When eu clico no botão de download
    Then o arquivo deve ser baixado
    And o arquivo deve ser idêntico ao original
    And o nome do arquivo deve estar correto
```

**Validações Planejadas:**
- Download iniciado automaticamente
- Arquivo salvo corretamente
- Integridade do arquivo mantida
- Nome e extensão corretos

---

### CT-DOC-005: Exclusão de Documento

**Objetivo:** Verificar se o sistema permite exclusão de documentos com confirmação.

**Prioridade:** Alta  
**Tipo:** Funcional  
**Status:** ⏳ Pendente Implementação  
**Arquivo:** `tests/documents.spec.ts:84`

**Gherkin:**
```gherkin
Feature: Exclusão de Documentos
  
  Scenario: Exclusão com confirmação
    Given que estou autenticado no sistema
    And estou visualizando a lista de documentos
    When eu clico em excluir um documento
    And confirmo a exclusão no modal
    Then devo ver mensagem de sucesso
    And o documento não deve mais aparecer na lista
    And tentativa de buscar o documento deve falhar
```

**Validações Planejadas:**
- Modal de confirmação exibido
- Exclusão apenas após confirmação
- Documento removido da lista
- Impossibilidade de recuperação
- Mensagem de sucesso clara

---

### CT-DOC-006: Validação de Tipos de Arquivo

**Objetivo:** Verificar se o sistema valida tipos de arquivo permitidos.

**Prioridade:** Alta  
**Tipo:** Funcional - Segurança  
**Status:** ⏳ Pendente Implementação  
**Arquivo:** `tests/documents.spec.ts:88`

**Dados de Teste:**
- **Permitidos:** .pdf, .doc, .docx, .txt, .jpg, .png
- **Bloqueados:** .exe, .bat, .sh, .js, .php

**Gherkin:**
```gherkin
Feature: Validação de Upload
  
  Scenario: Upload de arquivo permitido
    Given que estou autenticado no sistema
    When eu tento fazer upload de arquivo ".pdf"
    Then o upload deve ser aceito
  
  Scenario: Upload de arquivo bloqueado
    Given que estou autenticado no sistema
    When eu tento fazer upload de arquivo ".exe"
    Then devo ver mensagem de erro
    And o upload deve ser bloqueado
    And devo ver lista de tipos permitidos
```

**Validações Planejadas:**
- Validação client-side
- Validação server-side
- Mensagens claras de erro
- Lista de tipos permitidos
- Segurança contra arquivos maliciosos

---

## 4. Matriz de Rastreabilidade

| ID Caso de Teste | Requisito | Prioridade | Status | Ambiente | Tempo Exec. |
|------------------|-----------|------------|--------|----------|-------------|
| CT-DOC-001 | RF-004: Upload de Documentos | Alta | ⏳ Pendente | - | - |
| CT-DOC-002 | RF-005: Listagem de Documentos | Alta | ⏳ Pendente | - | - |
| CT-DOC-003 | RF-006: Busca de Documentos | Alta | ✅ Implementado | DEV | ~8.5s |
| CT-DOC-003-NEG | RF-006: Busca sem Resultados | Alta | ✅ Implementado | DEV | ~8.6s |
| CT-DOC-004 | RF-007: Download de Documentos | Alta | ⏳ Pendente | - | - |
| CT-DOC-005 | RF-008: Exclusão de Documentos | Alta | ⏳ Pendente | - | - |
| CT-DOC-006 | RNF-002: Validação de Tipos | Alta | ⏳ Pendente | - | - |

---

## 5. Estatísticas

### 5.1. Status Geral
**Total de Casos de Teste:** 7  
**Implementados:** 2 (28.6%)  
**Pendentes:** 5 (71.4%)  

### 5.2. Por Tipo
- **Funcional:** 6 casos (85.7%)
- **Funcional - Negativo:** 1 caso (14.3%)
- **Segurança:** 1 caso (14.3%)

### 5.3. Por Prioridade
- **Alta:** 7 casos (100%)

### 5.4. Cobertura por Funcionalidade
```
Busca de Documentos:     ████████████████████ 100% (2/2)
Upload de Documentos:    ░░░░░░░░░░░░░░░░░░░░   0% (0/1)
Listagem de Documentos:  ░░░░░░░░░░░░░░░░░░░░   0% (0/1)
Download de Documentos:  ░░░░░░░░░░░░░░░░░░░░   0% (0/1)
Exclusão de Documentos:  ░░░░░░░░░░░░░░░░░░░░   0% (0/1)
Validação de Tipos:      ░░░░░░░░░░░░░░░░░░░░   0% (0/1)
```

### 5.5. Performance
| Caso de Teste | Tempo Médio | Status |
|---------------|-------------|--------|
| Busca com resultados | 8.5s | ✅ OK |
| Busca sem resultados | 8.6s | ✅ OK |

---

## 6. Convenções e Padrões

### 6.1. Nomenclatura de IDs
- **CT-DOC-NNN:** Caso de teste positivo
- **CT-DOC-NNN-NEG:** Caso de teste negativo
- **NNN:** Número sequencial (001-999)

### 6.2. Status dos Testes
- ✅ **Implementado:** Código pronto e validado
- ⏳ **Pendente:** Aguardando implementação
- 🔧 **Em Desenvolvimento:** Work in progress
- ❌ **Bloqueado:** Impedimento identificado

### 6.3. Seletores Utilizados
```typescript
// Busca
searchInput: 'input[placeholder="Pesquisar documentos..."]'
documentTypeSelect: '[role="combobox"]'

// Resultados
documentCards: '.MuiCardContent-root'
documentTitle: 'h6.MuiTypography-subtitle1'
noResultsMessage: 'h6.MuiTypography-h6:has-text("Nenhum documento encontrado")'

// Informações do documento
documentType: 'span.MuiTypography-caption'
documentDate: '[data-testid="CalendarTodayIcon"] + span'
documentUser: '[data-testid="PersonIcon"] + span'
documentSize: '[data-testid="StorageIcon"] + span'
```

---

## 7. Dados de Teste

### 7.1. Documentos Existentes (DEV)
| Número | Tipo | Usuário | Tamanho | Data |
|--------|------|---------|---------|------|
| 2058 2013 | ProcessoMunicipal | Administrator | 497.52 KB | 12/11/2025 13:39 |

### 7.2. Dados para Testes Negativos
- **Números inexistentes:** 9999 9999, 0000 0000
- **Caracteres especiais:** @#$%, <script>
- **Strings longas:** Mais de 255 caracteres
- **Campo vazio:** ""

---

## 8. Próximos Passos

### 8.1. Prioridade Imediata
1. ✅ ~~Implementar busca com resultados~~
2. ✅ ~~Implementar busca sem resultados~~
3. ⏳ Implementar upload de documentos
4. ⏳ Implementar listagem de documentos

### 8.2. Melhorias Futuras
- Adicionar testes de paginação
- Testes de ordenação
- Testes de filtros combinados
- Testes de performance com grande volume
- Testes de concorrência (múltiplos usuários)

### 8.3. Automação
- Integrar com CI/CD
- Gerar relatórios automáticos
- Executar testes em múltiplos ambientes
- Notificações de falhas

---

## 9. Observações Técnicas

### 9.1. Timeouts Utilizados
- Processamento de busca: 1000ms
- Abertura de dropdown: 500ms
- Filtragem de resultados: 1000ms
- Aguardar resultados: 2000ms
- Verificação de visibilidade: 5000ms

### 9.2. Estratégia de Espera
- `waitForTimeout`: Para processamento conhecido
- `waitForLoadState('networkidle')`: Para carregamento de página
- `isVisible({ timeout: 5000 })`: Para verificações com retry

### 9.3. Tratamento de Erros
- Try-catch em verificações de visibilidade
- Retorno de false em documentos não encontrados
- Mensagens descritivas em assertions

---

**Documento mantido por:** Equipe de QA  
**Última atualização:** Novembro 2025  
**Próxima revisão:** Após implementação de upload e listagem  
**Responsável:** QA Team
