# Especificação de Requisitos e Regras de Negócio - DocSimples

> **Documento de Referência para Desenvolvimento e Quality Assurance**  
> **Versão:** 2.0  
> **Data:** 14/11/2025  
> **Status:** Aprovado para Desenvolvimento e Testes

---

## 📋 Sobre Este Documento

Este documento é o **guia oficial** para desenvolvimento e testes do sistema DocSimples. Contém:
- Conceitos e objetivos da aplicação
- Regras de Negócio (RN's) detalhadas e testáveis
- Critérios de aceitação para cada funcionalidade
- Cenários de teste sugeridos

**Público-alvo:** Desenvolvedores, QA Engineers, Product Owners, Tech Leads

---

## 🎯 Visão Geral do Sistema

### O que é o DocSimples?

**DocSimples** é uma plataforma de **Gestão Eletrônica de Documentos (GED)** e **Business Process Management (BPM)** desenvolvida para órgãos públicos e empresas que precisam:

- Gerenciar documentos eletrônicos e físicos de forma integrada
- Automatizar processos e workflows complexos
- Garantir segurança, auditoria e compliance
- Facilitar busca e recuperação de informações
- Permitir acesso móvel e colaboração entre equipes

### Objetivos do Sistema

1. **Centralizar** toda documentação em um repositório único e seguro
2. **Automatizar** fluxos de aprovação, tramitação e protocolos
3. **Rastrear** todas as operações para fins de auditoria e compliance
4. **Facilitar** acesso rápido à informação com busca avançada
5. **Garantir** segurança com controle granular de permissões e assinatura digital
6. **Mobilizar** equipes com acesso via dispositivos móveis

### Arquitetura Tecnológica

- **Backend:** Python/FastAPI + Nuxeo ECM + Flowable BPM
- **Frontend:** Next.js + React + Material-UI
- **Banco de Dados:** PostgreSQL + Redis + Qdrant (vetorial)
- **Integrações:** Google Drive, OneDrive, ERP, Web Services

---

## 📊 Estatísticas do Projeto

| Métrica | Valor |
|---------|-------|
| **Total de Requisitos** | 137 |
| **Obrigatórios** | 98 (71.5%) |
| **Desejáveis** | 39 (28.5%) |
| **Implementados** | 64 (46.7%) |
| **Parciais** | 28 (20.4%) |
| **Não Implementados** | 45 (32.9%) |
| **Módulos** | 13 principais |

---

---

## 🔐 RN-01: Gestão Documental e ECM (Electronic Content Management)

### Conceito

Sistema responsável por **gerenciar o ciclo de vida completo de documentos** (eletrônicos e físicos), desde criação, classificação, versionamento, até arquivamento ou descarte. Garante organização, rastreabilidade e conformidade com políticas de retenção.

### Objetivo de Negócio

Permitir que organizações **armazenem, organizem, versione e recuperem documentos** de forma eficiente, reduzindo tempo de busca, evitando duplicações e mantendo histórico completo de alterações.

---

### RN-01.01: Gestão Básica de Documentos

**Prioridade:** 🔴 CRÍTICA

#### Regras de Negócio

| ID | Regra | Tipo | Status | Aceite |
|----|-------|------|--------|--------|
| **RN-148** | O sistema DEVE gerenciar documentos eletrônicos e físicos de forma integrada, permitindo upload, download, visualização e metadados unificados | Obrigatório | ✅ IMPLEMENTADO | Usuário consegue criar/visualizar doc eletrônico e vincular referência a doc físico |
| **RN-149** | O sistema DEVE permitir classificar documentos por tipos (contrato, nota fiscal, ofício, etc.) com metadados específicos por tipo | Obrigatório | ✅ IMPLEMENTADO | Admin cria tipo "Contrato" com campos: número, partes, vigência; usuário cria doc desse tipo |
| **RN-151** | O sistema DEVE converter automaticamente arquivos Office/OpenOffice para PDF ao fazer upload | Obrigatório | ✅ IMPLEMENTADO | Upload de .docx retorna PDF acessível em até 30s |
| **RN-150** | O sistema DEVE permitir exportar metadados de documentos para Excel, Word e AutoCAD | Obrigatório | 🔄 PARCIAL | Exportação para Excel funciona; Word e AutoCAD pendentes |
| **RN-137** | O sistema DEVE exibir preview de PDFs e imagens (JPG, PNG) sem necessidade de download ou plugin externo | Desejável | ✅ IMPLEMENTADO | Preview aparece em modal/iframe ao clicar no documento |

#### Cenários de Teste (QA)

**CT-01.01.01 - Upload e Conversão de Documento**
```gherkin
Dado que usuário está logado com permissão de criar documentos
Quando faz upload de arquivo "contrato.docx" de 2MB
Então sistema converte para PDF em até 30 segundos
E exibe mensagem "Documento convertido com sucesso"
E PDF gerado possui mesmo conteúdo do original
```

**CT-01.01.02 - Classificação por Tipo**
```gherkin
Dado que admin criou tipo "Nota Fiscal" com campos: número, fornecedor, valor
Quando usuário cria novo documento do tipo "Nota Fiscal"
Então sistema exige preenchimento dos campos obrigatórios
E salva documento com metadados específicos
E permite busca posterior por esses metadados
```

**CT-01.01.03 - Preview de Documento**
```gherkin
Dado que existe documento "relatorio.pdf" no sistema
Quando usuário clica em visualizar
Então preview abre em modal sem necessidade de download
E permite navegação entre páginas
E exibe botão para download caso necessário
```

#### Implementação (DEV)

**Backend:**
- Endpoint: `POST /api/v1/documents/upload` (multipart/form-data)
- Service: `DocumentService.convert_to_pdf()` usando LibreOffice/Gotenberg
- Storage: Nuxeo ECM para repositório e versionamento

**Frontend:**
- Component: `DocumentUploader.tsx` com drag-and-drop
- Preview: `PDFViewer.tsx` usando react-pdf ou pdf.js

**Dependências:**
- Nuxeo Platform configurado
- LibreOffice/Gotenberg para conversão
- Storage S3/local para binários

---

### RN-01.02: Classificação e Organização

**Prioridade:** 🟡 ALTA

#### Regras de Negócio

| ID | Regra | Tipo | Status | Aceite |
|----|-------|------|--------|--------|
| **RN-156** | O sistema DEVE permitir classificação hierárquica ilimitada (categorias > subcategorias > sub-subcategorias...) | Obrigatório | 🔄 PARCIAL | Usuário cria estrutura com 5+ níveis; navegação em árvore funcional |
| **RN-109** | O sistema DEVE categorizar documentos automaticamente usando IA baseado em conteúdo e metadados | Obrigatório | ✅ IMPLEMENTADO | Upload de NF é categorizado como "Financeiro > Contas a Pagar" automaticamente |
| **RN-164** | O sistema DEVE permitir criar relacionamentos entre documentos (referências cruzadas, anexos, versões relacionadas) | Desejável | 🔄 BACKEND | Ao visualizar doc A, usuário vê lista de docs relacionados |

#### Cenários de Teste (QA)

**CT-01.02.01 - Hierarquia de Categorias**
```gherkin
Dado que admin está na tela de categorias
Quando cria estrutura: Jurídico > Contratos > Prestação de Serviços > TI
Então sistema permite navegar pela árvore
E permite arrastar documentos para cada nível
E exibe breadcrumb completo ao visualizar documento
```

**CT-01.02.02 - Categorização Automática com IA**
```gherkin
Dado que sistema possui modelo IA treinado para categorização
Quando usuário faz upload de PDF com texto "NOTA FISCAL ELETRÔNICA"
Então sistema sugere categoria "Financeiro > Notas Fiscais"
E permite usuário aceitar ou modificar sugestão
E aprende com correções do usuário (feedback loop)
```

#### Implementação (DEV)

**Backend:**
- Model: `Category` com self-reference (parent_id) para hierarquia
- Service: `AICategorizationService` usando modelo NLP (spaCy/transformers)
- Endpoint: `POST /api/v1/documents/auto-categorize`

**Frontend:**
- Component: `CategoryTree.tsx` com react-tree-select
- AI Suggestion: Modal com confiança % e opção de aceitar/rejeitar

**Modelo IA:**
- Training: Supervisionado com docs já categorizados
- Input: Texto extraído + metadados
- Output: Top 3 categorias com scores de confiança

---

### RN-01.03: Versionamento e Revisão

**Prioridade:** 🔴 CRÍTICA

#### Regras de Negócio

| ID | Regra | Tipo | Status | Aceite |
|----|-------|------|--------|--------|
| **RN-154** | O sistema DEVE gerar identificadores únicos para cada revisão (v1.0, v1.1, v2.0 ou formato customizado) | Obrigatório | ✅ IMPLEMENTADO | Nova versão recebe ID incremental; admin pode customizar formato |
| **RN-155** | O sistema DEVE manter histórico completo de revisões com data/hora, usuário, e valores anteriores de metadados | Obrigatório | ✅ IMPLEMENTADO | Histórico mostra "João alterou campo 'Status' de 'Rascunho' para 'Aprovado' em 10/11/2025 14:30" |
| **RN-167** | O sistema DEVE permitir versionamento ilimitado sem restrição de quantidade de versões por documento | Desejável | ✅ IMPLEMENTADO | Documento com 100+ versões funciona normalmente |
| **RN-168** | O sistema DEVE bloquear edição automática quando outro usuário estiver editando (lock concorrente) | Desejável | 🔄 BACKEND | Usuário B vê mensagem "Documento em edição por João (10:30)" ao tentar editar |
| **RN-103** | O sistema DEVE controlar revisão de processos administrativos com trilha de auditoria | - | ✅ IMPLEMENTADO | Processo mostra todas revisões com responsáveis e justificativas |

#### Cenários de Teste (QA)

**CT-01.03.01 - Criação de Nova Versão**
```gherkin
Dado que existe documento "Manual_Usuario_v1.0.pdf"
Quando usuário com permissão clica em "Nova Versão"
E faz upload de "Manual_Usuario_v2.pdf"
Então sistema cria versão "v2.0"
E mantém v1.0 acessível no histórico
E marca v2.0 como versão atual
E registra autor e timestamp da criação
```

**CT-01.03.02 - Lock Concorrente**
```gherkin
Dado que Usuário A está editando documento X
Quando Usuário B tenta editar mesmo documento
Então sistema exibe modal "Documento bloqueado por [Nome] desde [Hora]"
E oferece opções: "Solicitar liberação" ou "Abrir somente leitura"
E quando Usuário A salva ou cancela, libera lock automaticamente
```

**CT-01.03.03 - Histórico de Alterações**
```gherkin
Dado que documento teve 3 versões e 10 alterações de metadados
Quando usuário acessa histórico
Então sistema exibe timeline com:
  - Data/hora de cada alteração
  - Usuário responsável
  - Campo alterado (com valor antes/depois)
  - Versão do documento naquele momento
E permite comparar versões lado a lado (diff visual)
```

#### Implementação (DEV)

**Backend:**
- Model: `DocumentVersion` com FK para `Document`
- Service: `VersionService.create_version()` - incrementa automaticamente
- Lock: Redis com TTL de 30min, renovado a cada 5min durante edição

**Frontend:**
- Component: `VersionHistory.tsx` com timeline
- Lock UI: Polling a cada 10s para verificar status do lock
- Diff Visual: react-diff-viewer para comparar versões

**Database:**
```sql
CREATE TABLE document_versions (
  id UUID PRIMARY KEY,
  document_id UUID REFERENCES documents(id),
  version_number VARCHAR(50), -- v1.0, v1.1, v2.0
  file_path TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP,
  changelog JSONB -- {campo: {old: valor, new: valor}}
);
```

---

### RN-01.04: Workflow Documental

**Prioridade:** 🟡 ALTA

#### Regras de Negócio

| ID | Regra | Tipo | Status | Aceite |
|----|-------|------|--------|--------|
| **RN-152** | O sistema DEVE executar workflow completo: elaboração → revisão → aprovação → homologação com transições configuráveis | Obrigatório | 🔄 PARCIAL | Doc passa por 4 etapas; cada aprovador recebe notificação; rejeição retorna para etapa anterior |
| **RN-153** | O sistema DEVE integrar com Google Drive e OneDrive para edição colaborativa de documentos | Obrigatório | 🔄 PARCIAL | Usuário edita .docx no Google Docs; ao salvar, sistema sincroniza versão atualizada |
| **RN-157** | O sistema DEVE enviar alertas por e-mail quando documento atingir prazo de validade e criar tarefa de revalidação | Obrigatório | 🔄 PARCIAL | 30 dias antes do vencimento, responsável recebe e-mail + tarefa "Revalidar Contrato X" |
| **RN-170** | O sistema DEVE notificar usuários interessados quando novo documento for criado ou nova versão publicada | Desejável | 🔄 BACKEND | Usuários da área recebem notificação push/e-mail ao upload de doc relevante |

#### Cenários de Teste (QA)

**CT-01.04.01 - Workflow de Aprovação**
```gherkin
Dado que doc está em workflow "Aprovação de Contratos"
E workflow tem etapas: Elaboração → Revisão Jurídica → Aprovação Diretoria → Homologação
Quando elaborador finaliza documento
Então sistema move para "Revisão Jurídica"
E notifica revisor jurídico por e-mail
E revisor pode aprovar (próxima etapa) ou rejeitar (volta para elaborador)
E histórico registra todas transições com justificativas
```

**CT-01.04.02 - Integração Google Drive**
```gherkin
Dado que documento está vinculado ao Google Drive
Quando usuário clica em "Editar no Google Docs"
Então sistema abre editor do Google em nova aba
E ao salvar no Google, webhook sincroniza mudanças
E cria nova versão no DocSimples automaticamente
E mantém vínculo bidirecional (edição em qualquer plataforma sincroniza)
```

**CT-01.04.03 - Alerta de Validade**
```gherkin
Dado que contrato tem data de validade 31/12/2025
E campo "Alertar com antecedência" = 30 dias
Quando sistema executa job diário de verificação
Então em 01/12/2025 envia e-mail para responsável
E cria tarefa "Revalidar Contrato ABC" com prazo 31/12/2025
E tarefa aparece no dashboard do responsável
```

#### Implementação (DEV)

**Backend:**
- Workflow Engine: Flowable BPM integrado
- Endpoints: 
  - `POST /api/v1/workflows/{id}/advance` - avança etapa
  - `POST /api/v1/workflows/{id}/reject` - rejeita e volta
- Integração: OAuth2 para Google/Microsoft APIs
- Job: Celery task diária verificando `validity_date`

**Frontend:**
- Component: `WorkflowTimeline.tsx` mostra etapas atual/concluídas
- Integration: Botão "Editar no Google Docs" abre popup OAuth

**Notificações:**
- Email: Template Jinja2 + SMTP
- Push: WebSocket para notificações real-time no browser

---

### RN-01.05: Segurança e Marca d'Água

**Prioridade:** 🟢 MÉDIA

#### Regras de Negócio

| ID | Regra | Tipo | Status | Aceite |
|----|-------|------|--------|--------|
| **RN-169** | O sistema DEVE aplicar marca d'água configurável (texto/imagem) em PDFs e documentos Office ao visualizar/imprimir | Desejável | 🔄 PARCIAL | PDF exibido tem marca d'água "CONFIDENCIAL - [Nome Usuário] - [Data/Hora]" |
| **RN-41** | O sistema DEVE permitir configurar marca d'água diferente por categoria de documento | - | 🔄 BACKEND | Categoria "Contratos" usa marca vermelha diagonal; "Público" sem marca |

#### Cenários de Teste (QA)

**CT-01.05.01 - Aplicação de Marca d'Água**
```gherkin
Dado que admin configurou marca d'água "CONFIDENCIAL - {user} - {datetime}"
Quando usuário visualiza ou imprime PDF
Então cada página tem marca d'água em diagonal com 30% opacidade
E variáveis são substituídas: "CONFIDENCIAL - João Silva - 14/11/2025 10:30"
E marca não pode ser removida pelo usuário
```

**CT-01.05.02 - Marca d'Água por Categoria**
```gherkin
Dado que categoria "Sigiloso" tem marca d'água vermelha "SIGILOSO"
E categoria "Público" não tem marca d'água
Quando usuário visualiza doc da categoria "Sigiloso"
Então PDF tem marca vermelha aplicada
E quando visualiza doc "Público", não há marca d'água
```

#### Implementação (DEV)

**Backend:**
- Library: PyPDF2 ou reportlab para adicionar watermark
- Service: `WatermarkService.apply(document, user, template)`
- Template: Suporta variáveis: {user}, {datetime}, {department}, {classification}

**Frontend:**
- Preview sempre chama endpoint que aplica watermark server-side
- Não expõe PDF original sem marca

---

## RN-02: Controle de Acesso e Permissões

**Objetivo:** Garantir segurança granular no acesso a documentos e funcionalidades, com controle baseado em usuários, departamentos e níveis de autorização.

### RN-02.01: Sistema de Permissões

| ID | Descrição | Tipo | Status | Complexidade |
|----|-----------|------|--------|--------------|
| 138 | Hierarquia de acesso única (login) para todos os módulos | Obrigatório | ✅ IMPLEMENTADO | Alta |
| 139 | Configuração de permissões por módulo, funcionalidade e relatório | Obrigatório | ✅ IMPLEMENTADO | Alta |
| 145 | Controle de acesso restrito à ferramenta de auditoria (autorização) | Obrigatório | ✅ IMPLEMENTADO | Média |
| 48 | Sistema de permissões granulares avançado | Obrigatório | ✅ IMPLEMENTADO | Alta |

**Valor Estimado:** R$ 20.000 - R$ 32.500

### RN-02.02: DRM (Digital Rights Management)

| ID | Descrição | Tipo | Status | Complexidade |
|----|-----------|------|--------|--------------|
| 158 | Restrições de impressão, cópia, captura de tela, etc., por nível de permissão | Obrigatório | ✅ IMPLEMENTADO | Alta |
| 159 | Controle de acesso granular (público, departamental, funcional, usuário) | Obrigatório | ✅ IMPLEMENTADO | Alta |

**Valor Estimado:** R$ 10.000 - R$ 16.000

---

## RN-03: Assinatura Digital e Certificação

**Objetivo:** Permitir assinatura digital de documentos com certificados ICP-Brasil e carimbo de tempo, garantindo validade jurídica.

### RN-03.01: Assinatura Digital

| ID | Descrição | Tipo | Status | Complexidade |
|----|-----------|------|--------|--------------|
| 160 | Assinaturas digitais em PDF (ICP-Brasil, XML signature, CMS) | Obrigatório | 🔄 PARCIAL | Alta |
| 161 | Carimbo de tempo (ACT) nas assinaturas digitais | Obrigatório | 🔄 PARCIAL | Média |
| 162 | Fluxos de trabalho para assinatura digital configuráveis | Obrigatório | ⏳ NÃO IMPLEMENTADO | Média |
| 163 | Integração com tecnologias de assinatura eletrônica externas | Desejável | 🔄 PARCIAL | Média |

**Valor Estimado:** R$ 0 - R$ 0

### RN-03.02: Configuração de Certificados

| ID | Descrição | Tipo | Status | Complexidade |
|----|-----------|------|--------|--------------|
| 146 | Configuração de assinatura digital (certificados, fluxo) | Desejável | ⏳ NÃO IMPLEMENTADO | Alta |
| 147 | Interface para gerenciamento de chaves e certificados | Desejável | ⏳ NÃO IMPLEMENTADO | Média |

**Valor Estimado:** R$ 0 - R$ 0

---

## RN-04: Busca e Recuperação de Informação

**Objetivo:** Proporcionar mecanismos avançados de busca full-text, semântica e fonética para localização rápida de documentos.

### RN-04.01: Busca Avançada

| ID | Descrição | Tipo | Status | Complexidade |
|----|-----------|------|--------|--------------|
| 165 | Busca avançada por palavras-chave, metadados, atributos, full-text, fonética | Desejável | ✅ IMPLEMENTADO | Alta |
| 166 | Salvar critérios de pesquisa frequentes para reutilização | Desejável | ❌ NÃO IMPLEMENTADO | Média |

**Valor Estimado:** R$ 3.000 - R$ 5.000

---

## RN-05: Auditoria e Rastreabilidade

**Objetivo:** Registrar todas as operações realizadas no sistema para fins de compliance, auditoria e investigação.

### RN-05.01: Logs e Auditoria

| ID | Descrição | Tipo | Status | Complexidade |
|----|-----------|------|--------|--------------|
| 143 | Registro de auditoria completo (log de alterações, IP, usuário, timestamps) | Obrigatório | 🔄 PARCIAL | Alta |
| 144 | Ferramenta de consulta de auditoria com filtros (data, usuário, ação) | Obrigatório | 🔄 PARCIAL | Média |

**Valor Estimado:** R$ 0 - R$ 0

---

## RN-06: Configuração do Sistema

**Objetivo:** Permitir personalização e configuração do sistema para atender às necessidades específicas da organização.

### RN-06.01: Personalização

| ID | Descrição | Tipo | Status | Complexidade |
|----|-----------|------|--------|--------------|
| 140 | Personalização de logotipo institucional nas telas | Obrigatório | ⏳ NÃO IMPLEMENTADO | Média |
| 47 | Cadastro de secretarias e áreas | - | 🔄 BACKEND | - |

**Valor Estimado:** R$ 0 - R$ 0

### RN-06.02: Integrações

| ID | Descrição | Tipo | Status | Complexidade |
|----|-----------|------|--------|--------------|
| 141 | Integração de dados de ERP, bancos e arquivos via assistentes | Obrigatório | ⏳ NÃO IMPLEMENTADO | Alta |
| 142 | Configuração de segurança para cada análise (criptografia, auditoria) | Obrigatório | ⏳ NÃO IMPLEMENTADO | Alta |
| 113 | Acesso a BDs externos e web services | - | ✅ IMPLEMENTADO | - |

**Valor Estimado:** R$ 3.000 - R$ 5.000

### RN-06.03: Configurações Técnicas

| ID | Descrição | Tipo | Status | Complexidade |
|----|-----------|------|--------|--------------|
| 45 | Configuração de banco vetorial (Qdrant) | Obrigatório | 🔄 BACKEND | Alta |
| 42 | Solicitação de cópias | - | 🔄 BACKEND | - |
| 43 | Criação de links públicos | - | 🔄 BACKEND | - |
| 44 | Cadastro direto do MS Office | - | 🔄 BACKEND | - |
| 46 | Exportação de dados indexados | - | 🔄 BACKEND | - |

**Valor Estimado:** R$ 0 - R$ 0

---

## RN-07: Captura e Digitalização (Imaging)

**Objetivo:** Capturar, digitalizar e processar documentos físicos para armazenamento digital, incluindo OCR e tratamento de imagens.

### RN-07.01: Captura e Processamento

| ID | Descrição | Tipo | Status | Complexidade |
|----|-----------|------|--------|--------------|
| 131 | Relatórios de produtividade da captura (lotes, tempos, volumes) | Obrigatório | ✅ IMPLEMENTADO | Média |
| 174 | Suporte a upload de anexos nos formulários | Obrigatório | ✅ IMPLEMENTADO | Média |
| 102 | Detecção automática de documentos duplicados com IA | Obrigatório | ✅ IMPLEMENTADO | Alta |
| 106 | Workflow automatizado de captura e processamento | Obrigatório | ❌ NÃO IMPLEMENTADO | Alta |

**Valor Estimado:** R$ 7.000 - R$ 11.000

### RN-07.02: Visualização e Manipulação

| ID | Descrição | Tipo | Status | Complexidade |
|----|-----------|------|--------|--------------|
| 132 | Visualização 2D/3D de desenhos CAD (DWG, DXF) | Desejável | ⏳ NÃO IMPLEMENTADO | Média |
| 133 | Zoom, pan e medições em imagens raster (TIFF, BMP, JPEG, GIF) | Desejável | ⏳ NÃO IMPLEMENTADO | Média |
| 134 | Impressão e plotagem de desenhos/imagens | Desejável | ⏳ NÃO IMPLEMENTADO | Média |
| 135 | Anotações (markup) e comentários em documentos digitalizados | Desejável | ⏳ NÃO IMPLEMENTADO | Média |
| 136 | Comparação visual de diferenças entre dois desenhos DWG | Desejável | ⏳ NÃO IMPLEMENTADO | Média |

**Valor Estimado:** R$ 0 - R$ 0

---

## RN-08: Formulários Eletrônicos

**Objetivo:** Criar e gerenciar formulários eletrônicos customizáveis com validação, integração a workflows e histórico de preenchimento.

### RN-08.01: Designer de Formulários

| ID | Descrição | Tipo | Status | Complexidade |
|----|-----------|------|--------|--------------|
| 171 | Criação de formulários eletrônicos customizáveis por módulo | Obrigatório | 🔄 STANDALONE | Média |
| 172 | Validação de campos e regras de negócio nos formulários | Obrigatório | 🔄 STANDALONE | Média |
| 173 | Integração de formulários com workflows de aprovação | Obrigatório | 🔄 STANDALONE | Média |
| 175 | Histórico de respostas e auditoria de preenchimento | Obrigatório | 🔄 STANDALONE | Média |

**Valor Estimado:** R$ 3.438 - R$ 6.463 (Standalone)  
**Potencial:** R$ 22.000 - R$ 43.000

### RN-08.02: Funcionalidades Avançadas

| ID | Descrição | Tipo | Status | Complexidade |
|----|-----------|------|--------|--------------|
| 176 | Interface responsiva para preenchimento em dispositivos móveis | Desejável | 🔄 STANDALONE | Média |
| 177 | Exportação de respostas de formulários para CSV/Excel | Desejável | 🔄 STANDALONE | Média |
| 178 | Notificações por e-mail ao submeter formulário | Desejável | 🔄 STANDALONE | Média |

**Valor Estimado:** R$ 1.095 - R$ 2.057 (Standalone)  
**Potencial:** R$ 7.000 - R$ 14.000

---

## RN-09: Mobilidade

**Objetivo:** Permitir acesso ao sistema via dispositivos móveis (Android, iOS, tablets) com funcionalidades offline.

### RN-09.01: Acesso Mobile

| ID | Descrição | Tipo | Status | Complexidade |
|----|-----------|------|--------|--------------|
| 179 | Acesso ao sistema via dispositivos móveis (Android, iOS, tablets) | Obrigatório | ❌ NÃO IMPLEMENTADO | Alta |
| 180 | Sincronização offline de dados e documentos | Obrigatório | 🔄 PARCIAL | Alta |
| 181 | Interface adaptada para telas pequenas e toque | Obrigatório | ✅ IMPLEMENTADO | Média |

**Valor Estimado:** R$ 6.000 - R$ 12.000

### RN-09.02: Funcionalidades Mobile

| ID | Descrição | Tipo | Status | Complexidade |
|----|-----------|------|--------|--------------|
| 182 | Notificações push para pendências e tarefas | Desejável | ❌ NÃO IMPLEMENTADO | Média |
| 183 | Funcionalidade de captura de fotos/documentos via câmera | Desejável | ❌ NÃO IMPLEMENTADO | Média |

**Valor Estimado:** R$ 0 - R$ 0

---

## RN-10: Modelagem de Processos (BPMN)

**Objetivo:** Permitir modelagem visual de processos de negócio usando notação BPMN 2.0 com suporte a lanes, gateways e eventos.

### RN-10.01: Designer BPMN

| ID | Descrição | Tipo | Status | Complexidade |
|----|-----------|------|--------|--------------|
| 184 | Modelagem gráfica de processos (BPMN, fluxograma) com drag and drop | Obrigatório | ✅ IMPLEMENTADO | Alta |
| 185 | Suporte a lanes, gateways (AND, XOR, OR) e eventos | Obrigatório | ✅ IMPLEMENTADO | Média |
| 186 | Versionamento e controle de revisão de modelos de processo | Obrigatório | ✅ IMPLEMENTADO | Média |

**Valor Estimado:** R$ 89.000 - R$ 142.000

### RN-10.02: Análise e Exportação

| ID | Descrição | Tipo | Status | Complexidade |
|----|-----------|------|--------|--------------|
| 187 | Simulação e análise de desempenho de processos | Desejável | ✅ IMPLEMENTADO | Média |
| 188 | Exportação de diagramas para formatos SVG, PNG, PDF | Desejável | ✅ IMPLEMENTADO | Média |

**Valor Estimado:** Incluído nos valores acima

---

## RN-11: Protocolo e Tramitação

**Objetivo:** Gerenciar protocolos de documentos, registrar movimentações, gerar etiquetas e controlar prazos.

### RN-11.01: Gestão de Protocolos

| ID | Descrição | Tipo | Status | Complexidade |
|----|-----------|------|--------|--------------|
| 189 | Definir formato padrão de documentos de protocolo | Obrigatório | ❌ NÃO IMPLEMENTADO | Média |
| 190 | Registro e acompanhamento de movimentação de protocolos | Obrigatório | ❌ NÃO IMPLEMENTADO | Média |
| 191 | Impressão de etiquetas de processos e protocolos | Obrigatório | ❌ NÃO IMPLEMENTADO | Média |
| 192 | Alertas de etapas e prazos de protocolos | Obrigatório | ❌ NÃO IMPLEMENTADO | Média |
| 111 | Geração de QR codes e códigos de barra para protocolos | Obrigatório | ✅ IMPLEMENTADO | Alta |
| 112 | Associação de documentos a processos | - | ✅ IMPLEMENTADO | - |

**Valor Estimado:** R$ 6.000 - R$ 10.000

### RN-11.02: Funcionalidades Avançadas

| ID | Descrição | Tipo | Status | Complexidade |
|----|-----------|------|--------|--------------|
| 193 | Integração com fluxo de trabalho (workflow) de protocolos | Desejável | ❌ NÃO IMPLEMENTADO | Média |
| 194 | Relatórios de estatísticas de protocolos (volumes, tempos) | Desejável | ❌ NÃO IMPLEMENTADO | Média |
| 110 | Análise e simulação na elaboração | - | 🔄 PARCIAL | - |

**Valor Estimado:** R$ 1.000 - R$ 2.000

---

## RN-12: Workflow e Automação

**Objetivo:** Orquestrar fluxos de trabalho automatizados com tarefas, aprovações, delegações, SLA e notificações.

### RN-12.01: Engine de Workflow

| ID | Descrição | Tipo | Status | Complexidade |
|----|-----------|------|--------|--------------|
| 195 | Definição de fluxos de trabalho configuráveis por módulo | Obrigatório | ✅ IMPLEMENTADO | Alta |
| 196 | Engine de execução de workflow com suporte a tarefas, aprovações e timers | Obrigatório | ✅ IMPLEMENTADO | Alta |
| 197 | Monitoramento em tempo real de instâncias de workflow | Obrigatório | ✅ IMPLEMENTADO | Média |
| 198 | Integração de workflow com tarefas de Task Monitoring (REQ 106) | Obrigatório | ✅ IMPLEMENTADO | Média |

**Valor Estimado:** Incluído nos valores de BPMN

### RN-12.02: Notificações e Auditoria

| ID | Descrição | Tipo | Status | Complexidade |
|----|-----------|------|--------|--------------|
| 199 | Notificações por e-mail e push para eventos de workflow | Desejável | ✅ IMPLEMENTADO | Média |
| 200 | Histórico completo de auditoria de workflow (início, transição, fim) | Desejável | ✅ IMPLEMENTADO | Média |

**Valor Estimado:** Incluído nos valores de BPMN

### RN-12.03: Automação de Revisões

| ID | Descrição | Tipo | Status | Complexidade |
|----|-----------|------|--------|--------------|
| 104 | Automação de etapas de revisão | - | ❌ NÃO IMPLEMENTADO | - |
| 105 | Solicitação de revisão de processos | - | ❌ NÃO IMPLEMENTADO | - |
| 107 | Supervisão e controle de processos | - | ❌ NÃO IMPLEMENTADO | - |
| 108 | Redefinição de responsabilidades | - | ❌ NÃO IMPLEMENTADO | - |

**Valor Estimado:** R$ 0 - R$ 0

---

## RN-13: Gestão de Processos de Negócio (BPM)

**Objetivo:** Definir e gerenciar processos de negócio com etapas, responsáveis, prazos e integração com workflow.

### RN-13.01: Definição de Processos

| ID | Descrição | Tipo | Status | Complexidade |
|----|-----------|------|--------|--------------|
| 201 | Definição de processos de negócio com etapas, responsáveis e prazos | Obrigatório | ✅ IMPLEMENTADO | Alta |
| 202 | Integração de processos com workflow engine para automação | Obrigatório | ✅ IMPLEMENTADO | Alta |
| 203 | Monitoramento de métricas de desempenho de processos (tempo, custo) | Obrigatório | ✅ IMPLEMENTADO | Média |

**Valor Estimado:** Incluído nos valores de BPMN

### RN-13.02: Controle de Execução

| ID | Descrição | Tipo | Status | Complexidade |
|----|-----------|------|--------|--------------|
| 204 | Capacidade de iniciar, pausar, retomar e encerrar processos manualmente | Desejável | ✅ IMPLEMENTADO | Média |
| 205 | Exportação de diagramas e dados de processos para formatos BPMN, XML, PDF | Desejável | ✅ IMPLEMENTADO | Média |

**Valor Estimado:** Incluído nos valores de BPMN

---

## Análise de Gaps e Priorização

### Requisitos Críticos Não Implementados

1. **RN-03 (Assinatura Digital)** - 4 requisitos obrigatórios pendentes
2. **RN-11 (Protocolo)** - 4 requisitos obrigatórios pendentes  
3. **RN-09 (Mobilidade)** - 2 requisitos obrigatórios pendentes
4. **RN-06 (Configuração)** - 3 requisitos obrigatórios pendentes

### Módulos com Alto Grau de Implementação

1. **RN-02 (Permissões)** - 100% Production Ready - R$ 30.000 - R$ 48.500
2. **RN-10 (BPMN)** - 100% Production Ready - R$ 89.000 - R$ 142.000
3. **RN-12 (Workflow)** - 100% Production Ready
4. **RN-13 (BPM)** - 100% Production Ready

### Módulos em Desenvolvimento (Standalone)

1. **RN-08 (Formulários)** - Sistema completo standalone aguardando integração
   - Esforço de Integração: 6 horas
   - Valor Potencial: R$ 29.000 - R$ 57.000

---

## Anexos

### Módulos do Sistema

- **ADM** (Administration)
- **Arquivo Físico** (Physical Archive) - 100% Production Ready
- **Business Intelligence**
- **Captura/Imaging** - Parcialmente implementado
- **Configuração** (Configuration)
- **Documento** (Document/ECM)
- **Formulários** (Forms) - Standalone
- **Mobilidade** (Mobility)
- **Notação BPMN** - 100% Production Ready
- **Permissions/DRM** - 100% Production Ready
- **Processo** (Process/BPM) - 100% Production Ready
- **Protocolo** (Protocol)
- **Search** - Implementado
- **Workflow** - 100% Production Ready

### Legendas de Status

- **✅ IMPLEMENTADO:** Funcionalidade completa e operacional
- **🔄 PARCIAL:** Parcialmente implementado, requer complementação
- **🔄 BACKEND:** Backend implementado, falta API/Frontend
- **🔄 STANDALONE:** Sistema completo em ambiente separado, aguardando integração
- **⏳ NÃO IMPLEMENTADO:** Não iniciado
- **❌ NÃO IMPLEMENTADO:** Confirmadamente ausente

### Níveis de Complexidade

- **Alta:** Requisitos que envolvem múltiplos componentes, integrações complexas ou tecnologias avançadas
- **Média:** Requisitos com escopo moderado e dependências limitadas
- **Baixa:** Requisitos simples e diretos

---

**Documento Gerado Automaticamente**  
**Origem:** `/home/marcelo_om30/DocSimples/docs/Planejamento/Cursor/TimeToMarket/specs/Requisitos-GoogleCLI-SPECS-Atual/Adriana/base_oficial_requisitos_v2.json`  
**Data:** 2025-01-20
