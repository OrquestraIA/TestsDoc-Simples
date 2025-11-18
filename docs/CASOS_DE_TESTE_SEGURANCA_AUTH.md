# Casos de Teste - Segurança de Autenticação

**Projeto:** Doc+Simples  
**Módulo:** Segurança - Autenticação  
**Padrão:** ISO/IEC/IEEE 29119-3  
**Última Atualização:** 14 de Novembro de 2025

---

## 📋 Sumário Executivo

Este documento descreve os casos de teste de segurança relacionados ao processo de autenticação da aplicação Doc+Simples. Os testes cobrem proteções contra bypass, força bruta, exposição de dados sensíveis e invalidação de sessões.

**Total de Casos de Teste:** 16  
**Criticidade:** Alta (OWASP Top 10)

---

## 🎯 Objetivos dos Testes

- Verificar proteção contra acesso não autorizado
- Validar invalidação correta de sessões
- Garantir que dados sensíveis não são expostos
- Testar resiliência contra ataques de força bruta
- Verificar validação de inputs maliciosos
- Confirmar presença de headers de segurança

---

## 📊 Categorias de Testes

### 1. Bypass de Autenticação (3 testes)
### 2. Invalidação de Sessão (2 testes)
### 3. Proteção de Dados Sensíveis (3 testes)
### 4. Proteção contra Força Bruta (2 testes)
### 5. Validação de Input (2 testes)
### 6. Headers de Segurança (2 testes)
### 7. Múltiplas Sessões (2 testes)

---

## 🧪 Casos de Teste Detalhados

---

### **TC-SEC-AUTH-001: Não deve acessar dashboard sem autenticação**

**Categoria:** Bypass de Autenticação  
**Prioridade:** Crítica  
**Tipo:** Negativo

**Descrição:**  
Verificar que usuários não autenticados não podem acessar a página de dashboard diretamente.

**Pré-condições:**
- Usuário não está autenticado
- Aplicação está rodando

**Passos:**
1. Acessar URL `/dashboard` diretamente
2. Aguardar carregamento da página
3. Verificar URL resultante

**Resultado Esperado:**
- Usuário deve ser redirecionado para página de login
- OU receber erro 401 Unauthorized / 403 Forbidden
- Dashboard não deve ser exibido

**Dados de Teste:**
- URL: `/dashboard`

**Evidência:**
- Screenshot: `security-bypass-dashboard.png`

---

### **TC-SEC-AUTH-002: Não deve acessar documentos sem autenticação**

**Categoria:** Bypass de Autenticação  
**Prioridade:** Crítica  
**Tipo:** Negativo

**Descrição:**  
Verificar que a página de documentos está protegida contra acesso não autenticado.

**Pré-condições:**
- Usuário não está autenticado
- Aplicação está rodando

**Passos:**
1. Acessar URL `/documents` diretamente
2. Aguardar carregamento da página
3. Verificar proteção

**Resultado Esperado:**
- Acesso deve ser negado
- Redirecionamento para login ou erro 401/403

**Evidência:**
- Screenshot: `security-bypass-documents.png`

---

### **TC-SEC-AUTH-003: Não deve acessar arquivo físico sem autenticação**

**Categoria:** Bypass de Autenticação  
**Prioridade:** Crítica  
**Tipo:** Negativo

**Descrição:**  
Verificar proteção do módulo de arquivo físico.

**Pré-condições:**
- Usuário não está autenticado

**Passos:**
1. Acessar URL `/physical-archive`
2. Verificar resposta do sistema

**Resultado Esperado:**
- Acesso negado
- Redirecionamento ou erro apropriado

**Evidência:**
- Screenshot: `security-bypass-physical-archive.png`

---

### **TC-SEC-AUTH-004: Logout deve invalidar sessão completamente**

**Categoria:** Invalidação de Sessão  
**Prioridade:** Crítica  
**Tipo:** Funcional

**Descrição:**  
Garantir que o logout remove completamente a sessão do usuário.

**Pré-condições:**
- Usuário está autenticado

**Passos:**
1. Fazer login com credenciais válidas
2. Capturar cookies da sessão
3. Realizar logout
4. Capturar cookies após logout
5. Tentar acessar dashboard novamente

**Resultado Esperado:**
- Cookies de sessão devem ser removidos ou alterados
- Acesso a páginas protegidas deve ser negado
- Redirecionamento para login

**Dados de Teste:**
- Username: `administrator`
- Password: `password123`

**Evidência:**
- Screenshot: `security-logout-session-invalidated.png`

---

### **TC-SEC-AUTH-005: Sessão expirada deve redirecionar para login**

**Categoria:** Invalidação de Sessão  
**Prioridade:** Alta  
**Tipo:** Funcional

**Descrição:**  
Verificar comportamento quando sessão expira.

**Pré-condições:**
- Usuário está autenticado

**Passos:**
1. Fazer login
2. Obter cookies de sessão
3. Invalidar/limpar cookies manualmente (simular expiração)
4. Tentar acessar página protegida

**Resultado Esperado:**
- Sistema detecta sessão inválida
- Redireciona para página de login

**Evidência:**
- Screenshot: `security-expired-session.png`

---

### **TC-SEC-AUTH-006: Senha não deve aparecer em URLs**

**Categoria:** Proteção de Dados Sensíveis  
**Prioridade:** Crítica  
**Tipo:** Segurança

**Descrição:**  
Garantir que senhas nunca são expostas em URLs de requisições.

**Pré-condições:**
- Aplicação rodando

**Passos:**
1. Acessar página de login
2. Monitorar todas as requisições HTTP
3. Preencher formulário de login
4. Submeter formulário
5. Analisar URLs de todas as requisições

**Resultado Esperado:**
- Nenhuma URL deve conter a senha em texto claro
- Nenhuma URL deve ter parâmetros `password=` ou `senha=`
- Senhas devem ser enviadas apenas no body da requisição POST

**Dados de Teste:**
- Password: `password123`

---

### **TC-SEC-AUTH-007: Campo de senha deve ter type="password"**

**Categoria:** Proteção de Dados Sensíveis  
**Prioridade:** Média  
**Tipo:** Interface

**Descrição:**  
Verificar que campo de senha está configurado corretamente para ocultar caracteres.

**Pré-condições:**
- Página de login carregada

**Passos:**
1. Acessar página de login
2. Inspecionar campo de senha
3. Verificar atributo `type`

**Resultado Esperado:**
- Campo deve ter `type="password"`
- Caracteres digitados devem ser ocultados (•••)

**Evidência:**
- Screenshot: `security-password-field-type.png`

---

### **TC-SEC-AUTH-008: Senha não deve aparecer em console/logs**

**Categoria:** Proteção de Dados Sensíveis  
**Prioridade:** Alta  
**Tipo:** Segurança

**Descrição:**  
Garantir que senhas não são logadas no console do navegador.

**Pré-condições:**
- Console do navegador monitorado

**Passos:**
1. Ativar monitoramento de console
2. Fazer login
3. Analisar logs do console

**Resultado Esperado:**
- Senha não deve aparecer em nenhum log
- Nenhum objeto deve conter senha em texto claro

---

### **TC-SEC-AUTH-009: Múltiplas tentativas de login com falha**

**Categoria:** Proteção contra Força Bruta  
**Prioridade:** Alta  
**Tipo:** Segurança

**Descrição:**  
Testar comportamento do sistema após múltiplas tentativas falhas de login.

**Pré-condições:**
- Aplicação rodando

**Passos:**
1. Tentar login com senha incorreta 5 vezes
2. Observar comportamento do sistema
3. Verificar se há bloqueio ou delay

**Resultado Esperado:**
- Sistema deve implementar rate limiting
- Após X tentativas, deve bloquear temporariamente
- OU aumentar tempo de resposta progressivamente

**Dados de Teste:**
- Username: `invalid_user`
- Passwords: `senhaErrada1`, `senhaErrada2`, etc.

**Evidência:**
- Screenshot: `security-brute-force-attempts.png`

---

### **TC-SEC-AUTH-010: Tempo de resposta não deve revelar usuário válido**

**Categoria:** Proteção contra Força Bruta (Timing Attack)  
**Prioridade:** Média  
**Tipo:** Segurança

**Descrição:**  
Verificar se tempo de resposta é consistente independente de usuário existir.

**Pré-condições:**
- Aplicação rodando

**Passos:**
1. Medir tempo de resposta para usuário inexistente
2. Medir tempo de resposta para usuário válido com senha errada
3. Comparar tempos

**Resultado Esperado:**
- Diferença de tempo deve ser < 500ms
- Atacante não deve conseguir identificar usuários válidos por tempo de resposta

**Dados de Teste:**
- Usuário inexistente: `usuario_inexistente_12345`
- Usuário válido: `administrator`

---

### **TC-SEC-AUTH-011: Rejeitar username com caracteres especiais maliciosos**

**Categoria:** Validação de Input  
**Prioridade:** Crítica  
**Tipo:** Segurança

**Descrição:**  
Verificar que sistema trata corretamente inputs maliciosos.

**Pré-condições:**
- Página de login carregada

**Passos:**
1. Tentar login com SQL injection: `'; DROP TABLE users;--`
2. Tentar login com XSS: `<script>alert('XSS')</script>`
3. Tentar login com path traversal: `../../etc/passwd`
4. Tentar login com template injection: `${process.env.SECRET}`
5. Tentar login com bypass SQL: `admin' OR '1'='1`

**Resultado Esperado:**
- Nenhum input deve causar erro inesperado
- Todos devem ser tratados como credenciais inválidas
- Sistema não deve executar código malicioso
- Não deve causar vazamento de informações

**Evidência:**
- Screenshot: `security-malicious-input.png`

---

### **TC-SEC-AUTH-012: Campos vazios não devem permitir submit**

**Categoria:** Validação de Input  
**Prioridade:** Baixa  
**Tipo:** Validação

**Descrição:**  
Verificar validação de campos obrigatórios.

**Pré-condições:**
- Página de login carregada

**Passos:**
1. Tentar submeter formulário sem preencher campos
2. Verificar validação HTML5

**Resultado Esperado:**
- Campos devem ter atributo `required`
- Submit não deve ocorrer
- Mensagens de validação apropriadas

---

### **TC-SEC-AUTH-013: Headers de segurança devem estar configurados**

**Categoria:** Headers de Segurança  
**Prioridade:** Alta  
**Tipo:** Configuração

**Descrição:**  
Verificar presença de headers HTTP de segurança.

**Pré-condições:**
- Aplicação rodando

**Passos:**
1. Fazer requisição à aplicação
2. Capturar headers de resposta
3. Verificar headers de segurança

**Resultado Esperado:**  
Headers esperados:
- `X-Frame-Options: DENY` ou `SAMEORIGIN` (proteção contra clickjacking)
- `X-Content-Type-Options: nosniff` (proteção contra MIME sniffing)
- `X-XSS-Protection: 1; mode=block` (proteção XSS - legado)
- `Strict-Transport-Security` (HSTS - força HTTPS)
- `Content-Security-Policy` (CSP - controle de recursos)

---

### **TC-SEC-AUTH-014: Conexão deve usar HTTPS em produção**

**Categoria:** Headers de Segurança  
**Prioridade:** Crítica  
**Tipo:** Segurança

**Descrição:**  
Verificar que aplicação usa HTTPS em ambiente de produção.

**Pré-condições:**
- Aplicação em produção

**Passos:**
1. Acessar aplicação
2. Verificar protocolo da URL

**Resultado Esperado:**
- URL deve começar com `https://`
- Certificado SSL deve ser válido
- Localhost/dev pode usar HTTP

---

### **TC-SEC-AUTH-015: Múltiplas sessões do mesmo usuário**

**Categoria:** Múltiplas Sessões  
**Prioridade:** Média  
**Tipo:** Comportamento

**Descrição:**  
Verificar comportamento quando mesmo usuário faz login em múltiplos dispositivos/navegadores.

**Pré-condições:**
- Aplicação rodando

**Passos:**
1. Fazer login no navegador 1
2. Fazer login no navegador 2 com mesmo usuário
3. Verificar se sessão 1 ainda está ativa
4. Verificar se sessão 2 está ativa

**Resultado Esperado:**  
Comportamento aceitável (depende da regra de negócio):
- **Opção A:** Permitir múltiplas sessões (ambas ativas)
- **Opção B:** Invalidar sessão anterior (só sessão 2 ativa)
- **Opção C:** Bloquear nova sessão (só sessão 1 ativa)

**Evidência:**
- Screenshot: `security-multiple-sessions-page1.png`
- Screenshot: `security-multiple-sessions-page2.png`

---

### **TC-SEC-AUTH-016: Documentação de comportamento de múltiplas sessões**

**Categoria:** Múltiplas Sessões  
**Prioridade:** Baixa  
**Tipo:** Documentação

**Descrição:**  
Documentar e validar o comportamento definido para múltiplas sessões.

**Pré-condições:**
- Política de múltiplas sessões definida

**Passos:**
1. Consultar documentação/requisitos
2. Validar implementação conforme especificado

**Resultado Esperado:**
- Comportamento deve estar documentado
- Implementação deve seguir especificação

---

## 📊 Matriz de Rastreabilidade

| ID Caso de Teste | Categoria | OWASP Top 10 | Criticidade | Automação |
|------------------|-----------|--------------|-------------|-----------|
| TC-SEC-AUTH-001 | Bypass | A01:2021 – Broken Access Control | Crítica | ✅ Sim |
| TC-SEC-AUTH-002 | Bypass | A01:2021 – Broken Access Control | Crítica | ✅ Sim |
| TC-SEC-AUTH-003 | Bypass | A01:2021 – Broken Access Control | Crítica | ✅ Sim |
| TC-SEC-AUTH-004 | Invalidação | A07:2021 – Identification and Authentication Failures | Crítica | ✅ Sim |
| TC-SEC-AUTH-005 | Invalidação | A07:2021 – Identification and Authentication Failures | Alta | ✅ Sim |
| TC-SEC-AUTH-006 | Dados Sensíveis | A02:2021 – Cryptographic Failures | Crítica | ✅ Sim |
| TC-SEC-AUTH-007 | Dados Sensíveis | A04:2021 – Insecure Design | Média | ✅ Sim |
| TC-SEC-AUTH-008 | Dados Sensíveis | A09:2021 – Security Logging Failures | Alta | ✅ Sim |
| TC-SEC-AUTH-009 | Força Bruta | A07:2021 – Identification and Authentication Failures | Alta | ✅ Sim |
| TC-SEC-AUTH-010 | Força Bruta | A07:2021 – Identification and Authentication Failures | Média | ✅ Sim |
| TC-SEC-AUTH-011 | Validação | A03:2021 – Injection | Crítica | ✅ Sim |
| TC-SEC-AUTH-012 | Validação | A04:2021 – Insecure Design | Baixa | ✅ Sim |
| TC-SEC-AUTH-013 | Headers | A05:2021 – Security Misconfiguration | Alta | ✅ Sim |
| TC-SEC-AUTH-014 | Headers | A02:2021 – Cryptographic Failures | Crítica | ✅ Sim |
| TC-SEC-AUTH-015 | Sessões | A07:2021 – Identification and Authentication Failures | Média | ✅ Sim |
| TC-SEC-AUTH-016 | Sessões | A04:2021 – Insecure Design | Baixa | ⚠️ Manual |

---

## 📈 Estatísticas de Cobertura

- **Total de Casos de Teste:** 16
- **Casos Críticos:** 7 (43.75%)
- **Casos Altos:** 4 (25%)
- **Casos Médios:** 3 (18.75%)
- **Casos Baixos:** 2 (12.5%)
- **Automação:** 15/16 (93.75%)

---

## 🔍 Referências

- **OWASP Top 10 2021**: https://owasp.org/Top10/
- **OWASP Testing Guide**: https://owasp.org/www-project-web-security-testing-guide/
- **ISO/IEC/IEEE 29119-3**: Standard for Software Testing
- **CWE Top 25**: https://cwe.mitre.org/top25/

---

## 📝 Notas

1. **Rate Limiting**: A implementação de proteção contra força bruta deve ser feita no backend
2. **HTTPS**: Essencial em produção; localhost pode usar HTTP em desenvolvimento
3. **Múltiplas Sessões**: Comportamento depende da regra de negócio definida
4. **Headers de Segurança**: Devem ser configurados no servidor web (nginx, Apache) ou aplicação

---

**Documento preparado por:** GitHub Copilot  
**Aprovado por:** _[Pendente]_  
**Última Revisão:** 14/11/2025
