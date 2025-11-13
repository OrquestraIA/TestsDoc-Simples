Me ajude a recordar onde eu configuro modulos beta, em desenvolvimento, conforme imagem. 

---

**Cursor**

Olhando a imagem, vejo que você tem uma estrutura de módulos com diferentes status (BETA, DESABILITADO, Em Desenvolvimento).

Para configurar esses módulos e seus status no Doc+Simples, você provavelmente está usando um **arquivo de configuração de features/módulos**. Deixe-me procurar onde isso está configurado:

Perfeito! Encontrei o arquivo. Vou ler para você:

## ✅ ENCONTRADO!

Paulo, o arquivo de configuração dos módulos é:

```
frontend/config/modules.config.ts
```

---

## 📋 COMO CONFIGURAR OS MÓDULOS:

### **1. Status Disponíveis:**
```typescript
- 'production'  // 🟢 Totalmente funcional
- 'beta'        // 🟡 Funcional com avisos
- 'disabled'    // 🔴 Desabilitado
```

### **2. Para Alterar o Status de um Módulo:**

Basta editar a propriedade `status` no array `MODULES_CONFIG`:

```typescript
{
  id: 'workflows',
  name: 'Workflows',
  status: 'beta',  // ← Altere aqui: 'production', 'beta' ou 'disabled'
  // ...
}
```

### **3. Estrutura Atual:**

```yaml
🟢 PRODUCTION (3 módulos):
  - Dashboard
  - Documentos
  - Arquivo Físico

🟡 BETA (6 módulos):
  - Workflows
  - Busca Avançada
  - Sincronização Cloud
  - Notificações
  - Permissões
  - Analytics

🔴 DISABLED (7 módulos):
  - Digitalização
  - Segurança
  - Assinatura Digital
  - Configurações
  - Supervisão
  - Monitoramento
  - Integrações
```

---

## 🎯 EXEMPLO PRÁTICO:

**Para mover "Workflows" de BETA para PRODUCTION:**

```typescript
// Linha 80-90
{
  id: 'workflows',
  name: 'Workflows',
  description: 'Designer BPMN e execução de processos com Flowable',
  path: '/workflows',
  icon: 'AccountTreeIcon',
  status: 'production',  // ← Mudou de 'beta' para 'production'
  category: 'advanced',
  requiresPermission: ['workflows.view'],
  // betaWarning: 'Módulo em fase beta...',  ← Pode remover
  dependencies: ['flowable-engine']
}
```

---

## 💡 DICA:

O arquivo tem **helper functions** úteis:
- `getModuleConfig(moduleId)` - Pega config de um módulo
- `getModulesByStatus(status)` - Lista módulos por status
- `isModuleAccessible(moduleId)` - Verifica se está acessível

---

**Quer que eu ajude a alterar o status de algum módulo específico?** 🚀

```plaintext
frontend/config/modules.config.ts
```

```typescript
- 'production'  // 🟢 Totalmente funcional
- 'beta'        // 🟡 Funcional com avisos
- 'disabled'    // 🔴 Desabilitado
```

```typescript
{
  id: 'workflows',
  name: 'Workflows',
  status: 'beta',  // ← Altere aqui: 'production', 'beta' ou 'disabled'
  // ...
}
```

```yaml
🟢 PRODUCTION (3 módulos):
  - Dashboard
  - Documentos
  - Arquivo Físico

🟡 BETA (6 módulos):
  - Workflows
  - Busca Avançada
  - Sincronização Cloud
  - Notificações
  - Permissões
  - Analytics

🔴 DISABLED (7 módulos):
  - Digitalização
  - Segurança
  - Assinatura Digital
  - Configurações
  - Supervisão
  - Monitoramento
  - Integrações
```

```typescript
// Linha 80-90
{
  id: 'workflows',
  name: 'Workflows',
  description: 'Designer BPMN e execução de processos com Flowable',
  path: '/workflows',
  icon: 'AccountTreeIcon',
  status: 'production',  // ← Mudou de 'beta' para 'production'
  category: 'advanced',
  requiresPermission: ['workflows.view'],
  // betaWarning: 'Módulo em fase beta...',  ← Pode remover
  dependencies: ['flowable-engine']
}
```

---
