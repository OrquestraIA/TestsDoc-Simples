# Especificação de Casos de Teste - Doc+Simples

**Baseado em:** ISO/IEC/IEEE 29119-3 (Software Testing - Test Documentation)  
**Projeto:** Sistema de Gerenciamento de Documentos Doc+Simples  
**Data:** Novembro 2025  
**Versão:** 1.0

---

## Índice

1. [Módulo de Autenticação](#1-módulo-de-autenticação)
2. [Módulo de Gerenciamento de Documentos](#2-módulo-de-gerenciamento-de-documentos)
3. [Módulo de Interface do Usuário](#3-módulo-de-interface-do-usuário)
4. [Matriz de Rastreabilidade](#4-matriz-de-rastreabilidade)

---

## 1. Módulo de Autenticação

### 1.1. Escopo
Validar o processo de autenticação de usuários no sistema, incluindo login, logout e validações de segurança.

---

### CT-AUTH-001: Login com Credenciais Válidas

**Objetivo:** Verificar se o sistema permite o acesso de usuário com credenciais válidas.

**Pré-condições:**
- Sistema disponível e acessível
- Usuário cadastrado no sistema
- Navegador compatível

**Dados de Teste:**
- **Usuário:** Administrator
- **Senha:** Administrator

**Gherkin:**
```gherkin
Feature: Autenticação de Usuário
  Como um usuário do sistema
  Eu quero realizar login com minhas credenciais
  Para acessar as funcionalidades do sistema

  Scenario: Login bem-sucedido com credenciais válidas
    Given que estou na página de login
    And o formulário de login está visível
    When eu preencho o campo "usuário" com "Administrator"
    And eu preencho o campo "senha" com "Administrator"
    And eu clico no botão "Entrar"
    Then devo ser redirecionado para o dashboard
    And devo ver a mensagem "Bem-vindo ao Doc+Simples"
    And devo ver meu nome "Administrator" na interface
```

**Passos:**
1. Navegar para URL base da aplicação
2. Aguardar carregamento completo da página
3. Verificar visibilidade do campo "usuário"
4. Verificar visibilidade do campo "senha"
5. Preencher campo "usuário" com "Administrator"
6. Preencher campo "senha" com "Administrator"
7. Clicar no botão "Entrar"
8. Aguardar navegação para dashboard

**Resultado Esperado:**
- Redirecionamento para `/dashboard`
- Título "Bem-vindo ao Doc+Simples Serviços Eletrônicos" visível
- Nome do usuário "Administrator" exibido no header
- Dashboard com widgets de documentos visível

**Prioridade:** Alta  
**Tipo:** Funcional  
**Status:** ✅ Implementado  
**Arquivo:** `tests/auth.spec.ts:11`

---

### CT-AUTH-002: Login com Credenciais Inválidas

**Objetivo:** Verificar se o sistema impede o acesso com credenciais incorretas e exibe mensagem apropriada.

**Pré-condições:**
- Sistema disponível e acessível
- Navegador compatível

**Dados de Teste:**
- **Usuário:** invalid_user
- **Senha:** wrong_password

**Gherkin:**
```gherkin
Feature: Autenticação de Usuário
  
  Scenario: Tentativa de login com credenciais inválidas
    Given que estou na página de login
    When eu preencho o campo "usuário" com "invalid_user"
    And eu preencho o campo "senha" com "wrong_password"
    And eu clico no botão "Entrar"
    Then devo permanecer na página de login
    And devo ver uma mensagem de erro
    And o formulário de login deve estar visível
```

**Passos:**
1. Navegar para URL base da aplicação
2. Aguardar carregamento completo da página
3. Preencher campo "usuário" com "invalid_user"
4. Preencher campo "senha" com "wrong_password"
5. Clicar no botão "Entrar"
6. Aguardar resposta do sistema (2 segundos)
7. Verificar URL atual

**Resultado Esperado:**
- Permanece na página de login
- Mensagem de erro exibida (se implementado)
- Formulário de login continua visível
- Campos podem ser preenchidos novamente

**Prioridade:** Alta  
**Tipo:** Funcional - Negativo  
**Status:** ✅ Implementado  
**Arquivo:** `tests/auth.spec.ts:30`

---

### CT-AUTH-003: Logout do Sistema

**Objetivo:** Verificar se o usuário consegue realizar logout e é redirecionado para a tela de login.

**Pré-condições:**
- Sistema disponível
- Usuário autenticado no sistema
- Dashboard visível

**Gherkin:**
```gherkin
Feature: Autenticação de Usuário
  
  Scenario: Logout bem-sucedido
    Given que estou autenticado no sistema
    And estou na página do dashboard
    When eu clico no avatar do usuário
    And aguardo o menu aparecer
    And eu clico na opção "Sair"
    Then devo ser redirecionado para a página de login
    And o formulário de login deve estar visível
    And não devo ter acesso ao dashboard sem autenticar novamente
```

**Passos:**
1. Realizar login com credenciais válidas
2. Aguardar carregamento do dashboard
3. Verificar que está logado
4. Clicar no botão do avatar (círculo com letra "A")
5. Aguardar menu aparecer (1.5 segundos)
6. Localizar opção "Sair" ou "Logout"
7. Clicar na opção de logout
8. Aguardar processo de logout (2 segundos)
9. Verificar URL atual

**Resultado Esperado:**
- URL não contém `/dashboard`
- Formulário de login está visível
- Sessão do usuário encerrada
- Tentativa de acessar dashboard sem login deve redirecionar para login

**Prioridade:** Alta  
**Tipo:** Funcional  
**Status:** ✅ Implementado  
**Arquivo:** `tests/auth.spec.ts:42`

---

### CT-AUTH-004: Validação de Campos Obrigatórios

**Objetivo:** Verificar se o sistema valida campos obrigatórios antes de processar o login.

**Pré-condições:**
- Sistema disponível e acessível
- Navegador compatível

**Gherkin:**
```gherkin
Feature: Validação de Formulário de Login
  
  Scenario: Submissão com campos vazios
    Given que estou na página de login
    When eu deixo os campos "usuário" e "senha" vazios
    And eu clico no botão "Entrar"
    Then devo permanecer na página de login
    And os campos devem ser marcados como obrigatórios
  
  Scenario: Submissão apenas com usuário
    Given que estou na página de login
    When eu preencho apenas o campo "usuário" com "Administrator"
    And eu deixo o campo "senha" vazio
    And eu clico no botão "Entrar"
    Then devo permanecer na página de login
    And o campo "senha" deve ser marcado como obrigatório
```

**Passos:**
1. Navegar para página de login
2. Verificar visibilidade do botão "Entrar"
3. **Teste 1 - Campos vazios:**
   - Clicar no botão "Entrar" sem preencher nada
   - Aguardar validação (1 segundo)
   - Verificar que permanece na página de login
4. **Teste 2 - Apenas usuário:**
   - Preencher campo "usuário" com "Administrator"
   - Deixar campo "senha" vazio
   - Clicar no botão "Entrar"
   - Aguardar validação (1 segundo)
   - Verificar que permanece na página de login

**Resultado Esperado:**
- Sistema não processa login com campos vazios
- Formulário de login permanece visível
- Validação client-side ou server-side impede envio
- Campos podem ser preenchidos após tentativa

**Prioridade:** Média  
**Tipo:** Funcional - Validação  
**Status:** ✅ Implementado  
**Arquivo:** `tests/auth.spec.ts:75`

---

## 2. Módulo de Gerenciamento de Documentos

### 2.1. Escopo
Validar as funcionalidades de gestão de documentos, incluindo upload, listagem, busca, download e exclusão.

---

### CT-DOC-001: Upload de Documento

**Objetivo:** Verificar se o sistema permite upload de documentos válidos.

**Pré-condições:**
- Usuário autenticado
- Acesso à funcionalidade de upload
- Arquivo de teste disponível

**Dados de Teste:**
- **Arquivo:** sample.txt (text/plain)
- **Tamanho:** < 10MB
- **Localização:** `test-data/sample.txt`

**Gherkin:**
```gherkin
Feature: Gerenciamento de Documentos
  Como um usuário autenticado
  Eu quero fazer upload de documentos
  Para armazená-los no sistema

  Scenario: Upload bem-sucedido de documento válido
    Given que estou autenticado no sistema
    And estou na página de documentos
    When eu clico no botão "Upload"
    And eu seleciono o arquivo "sample.txt"
    And eu confirmo o upload
    Then devo ver uma mensagem de sucesso
    And o documento deve aparecer na lista
    And as informações do documento devem estar corretas
```

**Passos:**
1. Autenticar no sistema
2. Navegar para página de documentos
3. Localizar botão "Upload"
4. Clicar no botão "Upload"
5. Selecionar arquivo do diretório test-data
6. Confirmar seleção
7. Aguardar processamento
8. Verificar mensagem de sucesso
9. Verificar documento na listagem

**Resultado Esperado:**
- Upload processado com sucesso
- Mensagem "Documento enviado com sucesso" exibida
- Documento aparece na lista
- Nome, tipo e tamanho corretos
- Documento pode ser localizado por busca

**Prioridade:** Alta  
**Tipo:** Funcional  
**Status:** ⏳ Pendente Implementação  
**Arquivo:** `tests/documents.spec.ts:8`

---

### CT-DOC-002: Listagem de Documentos

**Objetivo:** Verificar se o sistema exibe corretamente a lista de documentos cadastrados.

**Pré-condições:**
- Usuário autenticado
- Ao menos um documento cadastrado no sistema

**Gherkin:**
```gherkin
Feature: Gerenciamento de Documentos
  
  Scenario: Visualização da lista de documentos
    Given que estou autenticado no sistema
    And existem documentos cadastrados
    When eu acesso a página de documentos
    Then devo ver a lista de documentos
    And cada documento deve exibir nome, tipo e data
    And a lista deve estar ordenada por data (mais recente primeiro)
```

**Resultado Esperado:**
- Grid/tabela de documentos visível
- Informações corretas de cada documento
- Ordenação por data decrescente
- Paginação se necessário

**Prioridade:** Alta  
**Tipo:** Funcional  
**Status:** ⏳ Pendente Implementação  
**Arquivo:** `tests/documents.spec.ts:12`

---

### CT-DOC-003: Busca de Documentos

**Objetivo:** Verificar se a funcionalidade de busca retorna resultados corretos.

**Pré-condições:**
- Usuário autenticado
- Múltiplos documentos cadastrados

**Gherkin:**
```gherkin
Feature: Gerenciamento de Documentos
  
  Scenario: Busca por nome de documento
    Given que estou autenticado no sistema
    And existem documentos cadastrados
    When eu clico no botão "Buscar"
    And eu digito "sample" no campo de busca
    And eu confirmo a busca
    Then devo ver apenas documentos que contenham "sample" no nome
    And documentos que não correspondem devem ser ocultados
```

**Resultado Esperado:**
- Sistema filtra documentos pelo termo
- Resultados exibidos dinamicamente
- Busca case-insensitive
- Opção de limpar busca

**Prioridade:** Média  
**Tipo:** Funcional  
**Status:** ⏳ Pendente Implementação  
**Arquivo:** `tests/documents.spec.ts:16`

---

### CT-DOC-004: Download de Documento

**Objetivo:** Verificar se o usuário consegue baixar documentos armazenados.

**Pré-condições:**
- Usuário autenticado
- Documento disponível para download

**Gherkin:**
```gherkin
Feature: Gerenciamento de Documentos
  
  Scenario: Download bem-sucedido de documento
    Given que estou autenticado no sistema
    And estou visualizando a lista de documentos
    When eu clico na opção "Download" do documento "sample.txt"
    Then o arquivo deve ser baixado
    And o arquivo baixado deve ser idêntico ao original
```

**Resultado Esperado:**
- Download iniciado automaticamente
- Arquivo salvo no diretório de downloads
- Integridade do arquivo mantida
- Nome do arquivo correto

**Prioridade:** Alta  
**Tipo:** Funcional  
**Status:** ⏳ Pendente Implementação  
**Arquivo:** `tests/documents.spec.ts:20`

---

### CT-DOC-005: Exclusão de Documento

**Objetivo:** Verificar se o sistema permite exclusão de documentos com confirmação.

**Pré-condições:**
- Usuário autenticado
- Documento existente no sistema
- Permissões adequadas para exclusão

**Gherkin:**
```gherkin
Feature: Gerenciamento de Documentos
  
  Scenario: Exclusão bem-sucedida de documento
    Given que estou autenticado no sistema
    And estou visualizando a lista de documentos
    When eu clico na opção "Excluir" do documento "sample.txt"
    And eu confirmo a exclusão no modal
    Then devo ver mensagem de sucesso
    And o documento não deve mais aparecer na lista
    And tentativa de buscar o documento deve falhar
```

**Resultado Esperado:**
- Modal de confirmação exibido
- Após confirmação, documento excluído
- Mensagem "Documento excluído com sucesso"
- Documento removido da listagem
- Documento não pode ser recuperado

**Prioridade:** Alta  
**Tipo:** Funcional  
**Status:** ⏳ Pendente Implementação  
**Arquivo:** `tests/documents.spec.ts:24`

---

### CT-DOC-006: Validação de Tipos de Arquivo Permitidos

**Objetivo:** Verificar se o sistema valida e aceita apenas tipos de arquivo permitidos.

**Pré-condições:**
- Usuário autenticado
- Arquivos de diferentes tipos disponíveis

**Dados de Teste:**
- **Permitidos:** .pdf, .doc, .docx, .txt, .jpg, .png
- **Bloqueados:** .exe, .bat, .sh, .js

**Gherkin:**
```gherkin
Feature: Gerenciamento de Documentos
  
  Scenario: Upload de arquivo permitido
    Given que estou autenticado no sistema
    When eu tento fazer upload de arquivo ".pdf"
    Then o upload deve ser processado com sucesso
  
  Scenario: Upload de arquivo não permitido
    Given que estou autenticado no sistema
    When eu tento fazer upload de arquivo ".exe"
    Then devo ver mensagem de erro
    And o upload deve ser bloqueado
```

**Resultado Esperado:**
- Arquivos permitidos são aceitos
- Arquivos bloqueados são rejeitados
- Mensagem clara sobre tipos permitidos
- Validação client-side e server-side

**Prioridade:** Alta  
**Tipo:** Funcional - Segurança  
**Status:** ⏳ Pendente Implementação  
**Arquivo:** `tests/documents.spec.ts:28`

---

## 3. Módulo de Interface do Usuário

### 3.1. Escopo
Validar aspectos de usabilidade, responsividade e feedback da interface.

---

### CT-UI-001: Responsividade em Mobile

**Objetivo:** Verificar se a interface adapta-se corretamente para dispositivos móveis.

**Pré-condições:**
- Sistema acessível
- Emulador mobile configurado

**Dados de Teste:**
- **Dispositivo:** Pixel 5 (393x851px)
- **Orientação:** Portrait e Landscape

**Gherkin:**
```gherkin
Feature: Interface Responsiva
  
  Scenario: Visualização em dispositivo móvel
    Given que acesso o sistema em dispositivo móvel
    When a página carregar
    Then os elementos devem estar dispostos verticalmente
    And os botões devem ser facilmente clicáveis
    And não deve haver scroll horizontal
    And o menu deve ser adaptado para mobile
```

**Resultado Esperado:**
- Layout adaptado para mobile
- Elementos empilhados verticalmente
- Fontes legíveis
- Botões com área de toque adequada (min 44x44px)
- Menu hamburger funcional

**Prioridade:** Média  
**Tipo:** Não-Funcional - Usabilidade  
**Status:** ⏳ Pendente Implementação  
**Arquivo:** `tests/ui.spec.ts:4`

---

### CT-UI-002: Responsividade em Tablet

**Objetivo:** Verificar se a interface adapta-se corretamente para tablets.

**Pré-condições:**
- Sistema acessível
- Emulador tablet configurado

**Dados de Teste:**
- **Dispositivo:** iPad (768x1024px)
- **Orientação:** Portrait e Landscape

**Gherkin:**
```gherkin
Feature: Interface Responsiva
  
  Scenario: Visualização em tablet
    Given que acesso o sistema em tablet
    When a página carregar
    Then o layout deve aproveitar o espaço disponível
    And os elementos devem estar bem distribuídos
    And a navegação deve ser intuitiva
```

**Resultado Esperado:**
- Layout otimizado para tablet
- Aproveitamento adequado do espaço
- Grid adaptativo
- Navegação fluida

**Prioridade:** Baixa  
**Tipo:** Não-Funcional - Usabilidade  
**Status:** ⏳ Pendente Implementação  
**Arquivo:** `tests/ui.spec.ts:8`

---

### CT-UI-003: Navegação Entre Páginas

**Objetivo:** Verificar se a navegação entre diferentes seções funciona corretamente.

**Pré-condições:**
- Usuário autenticado
- Dashboard visível

**Gherkin:**
```gherkin
Feature: Navegação do Sistema
  
  Scenario: Navegação entre módulos
    Given que estou autenticado no sistema
    When eu clico no menu "Documentos"
    Then devo ser direcionado para página de documentos
    When eu clico no menu "Dashboard"
    Then devo voltar para o dashboard
    And a página correta deve estar ativa no menu
```

**Resultado Esperado:**
- Transições suaves entre páginas
- URL atualizada corretamente
- Item de menu ativo destacado
- Breadcrumb atualizado se existir

**Prioridade:** Média  
**Tipo:** Funcional  
**Status:** ⏳ Pendente Implementação  
**Arquivo:** `tests/ui.spec.ts:12`

---

### CT-UI-004: Mensagens de Feedback ao Usuário

**Objetivo:** Verificar se o sistema fornece feedback adequado para ações do usuário.

**Pré-condições:**
- Usuário autenticado
- Sistema responsivo

**Gherkin:**
```gherkin
Feature: Feedback do Sistema
  
  Scenario: Feedback de operações bem-sucedidas
    Given que estou autenticado no sistema
    When eu realizo uma ação bem-sucedida
    Then devo ver uma mensagem de confirmação
    And a mensagem deve desaparecer após alguns segundos
  
  Scenario: Feedback de operações com erro
    Given que estou autenticado no sistema
    When uma operação falha
    Then devo ver uma mensagem de erro clara
    And a mensagem deve indicar o que fazer
```

**Resultado Esperado:**
- Mensagens de sucesso em verde
- Mensagens de erro em vermelho
- Mensagens de aviso em amarelo
- Auto-dismiss após 3-5 segundos
- Possibilidade de fechar manualmente

**Prioridade:** Média  
**Tipo:** Não-Funcional - Usabilidade  
**Status:** ⏳ Pendente Implementação  
**Arquivo:** `tests/ui.spec.ts:16`

---

## 4. Matriz de Rastreabilidade

| ID Caso de Teste | Requisito | Prioridade | Status | Ambiente Teste |
|------------------|-----------|------------|--------|----------------|
| CT-AUTH-001 | RF-001: Autenticação de Usuário | Alta | ✅ Implementado | DEV, HOMOLOG, PROD |
| CT-AUTH-002 | RF-002: Validação de Credenciais | Alta | ✅ Implementado | DEV, HOMOLOG, PROD |
| CT-AUTH-003 | RF-003: Logout de Usuário | Alta | ✅ Implementado | DEV, HOMOLOG, PROD |
| CT-AUTH-004 | RNF-001: Validação de Entrada | Média | ✅ Implementado | DEV, HOMOLOG, PROD |
| CT-DOC-001 | RF-004: Upload de Documentos | Alta | ⏳ Pendente | - |
| CT-DOC-002 | RF-005: Listagem de Documentos | Alta | ⏳ Pendente | - |
| CT-DOC-003 | RF-006: Busca de Documentos | Média | ⏳ Pendente | - |
| CT-DOC-004 | RF-007: Download de Documentos | Alta | ⏳ Pendente | - |
| CT-DOC-005 | RF-008: Exclusão de Documentos | Alta | ⏳ Pendente | - |
| CT-DOC-006 | RNF-002: Validação de Tipos | Alta | ⏳ Pendente | - |
| CT-UI-001 | RNF-003: Responsividade Mobile | Média | ⏳ Pendente | - |
| CT-UI-002 | RNF-004: Responsividade Tablet | Baixa | ⏳ Pendente | - |
| CT-UI-003 | RF-009: Navegação do Sistema | Média | ⏳ Pendente | - |
| CT-UI-004 | RNF-005: Feedback ao Usuário | Média | ⏳ Pendente | - |

---

## 5. Estatísticas

**Total de Casos de Teste:** 14  
**Implementados:** 4 (28.6%)  
**Pendentes:** 10 (71.4%)  

**Por Módulo:**
- **Autenticação:** 4/4 (100%) ✅
- **Documentos:** 0/6 (0%) ⏳
- **Interface:** 0/4 (0%) ⏳

**Por Prioridade:**
- **Alta:** 9 casos (64.3%)
- **Média:** 4 casos (28.6%)
- **Baixa:** 1 caso (7.1%)

---

## 6. Convenções e Padrões

### 6.1. Nomenclatura
- **CT-XXX-NNN:** Identificador único do caso de teste
  - **XXX:** Módulo (AUTH, DOC, UI)
  - **NNN:** Número sequencial (001-999)

### 6.2. Status
- ✅ **Implementado:** Teste codificado e funcional
- ⏳ **Pendente:** Aguardando implementação
- 🔧 **Em Desenvolvimento:** Em progresso
- ❌ **Bloqueado:** Impedimento técnico ou de requisito

### 6.3. Prioridades
- **Alta:** Funcionalidade crítica para o negócio
- **Média:** Funcionalidade importante mas não crítica
- **Baixa:** Nice-to-have, pode ser postergado

---

## 7. Próximos Passos

1. ✅ Implementar testes de autenticação
2. ⏳ Implementar testes de gerenciamento de documentos
3. ⏳ Implementar testes de interface/UI
4. ⏳ Adicionar testes de performance
5. ⏳ Adicionar testes de segurança
6. ⏳ Integrar com CI/CD

---

**Documento mantido por:** Equipe de QA  
**Última atualização:** Novembro 2025  
**Próxima revisão:** A definir
