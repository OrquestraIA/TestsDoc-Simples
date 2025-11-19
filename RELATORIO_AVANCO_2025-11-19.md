# Relatório de Avanço - 19/11/2025

## Objetivo

- Garantir a execução, publicação e acesso aos relatórios de testes Playwright via pipeline (GitHub Actions) e localmente.
- Permitir colaboração e onboarding de novos membros no processo de testes automatizados.

## Principais Atividades Realizadas

### 1. Diagnóstico e Correção do Workflow
- Revisão e ajuste do workflow do GitHub Actions para garantir a geração e publicação do relatório Playwright.
- Adição de steps de debug para listar arquivos e garantir que o relatório está sendo copiado corretamente.
- Correção do script de geração de relatório customizado para sempre copiar o relatório Playwright para o local correto.
- Ajuste do link/iframe no relatório customizado para garantir acesso ao relatório interativo.
- Adição de `continue-on-error: true` para garantir que o relatório seja publicado mesmo com falhas nos testes.

### 2. Testes Locais e na Pipeline
- Validação da geração do relatório Playwright localmente e na pipeline.
- Forçado um teste propositalmente falho para validar o fluxo de falha e geração de evidências (screenshot, vídeo).
- Ajuste de seletores nos testes para evitar skips indevidos e garantir robustez.
- Conferência do número total de testes e validação dos resultados no dashboard customizado.

### 3. Colaboração e Onboarding
- Adição de colaboradores ao repositório com permissões adequadas.
- Orientação sobre como rodar os testes localmente e na pipeline.
- Criação de tutorial em vídeo e inclusão no README para facilitar o onboarding.
- Explicação sobre runners self-hosted: necessidade de manter o runner ativo e possibilidade de múltiplos runners.

### 4. Documentação
- Atualização do README com passo a passo para rodar os testes na pipeline.
- Inclusão de tutorial em vídeo (YouTube e arquivo local) no README.
- Orientação sobre limites de upload de arquivos grandes no GitHub.

## Como instalar um self-hosted runner do GitHub Actions

1. **Acesse o repositório no GitHub**
   - Vá em Settings > Actions > Runners > New self-hosted runner.

2. **Escolha o sistema operacional**
   - Selecione Linux, Windows ou macOS conforme sua máquina.

3. **Siga os comandos sugeridos pelo GitHub:**
   - Exemplo para Linux:
     ```bash
     mkdir actions-runner && cd actions-runner
     curl -o actions-runner-linux-x64-2.316.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.316.0/actions-runner-linux-x64-2.316.0.tar.gz
     tar xzf ./actions-runner-linux-x64-2.316.0.tar.gz
     ./config.sh --url https://github.com/OrquestraIA/TestsDoc-Simples --token SEU_TOKEN
     ./run.sh
     ```
   - O GitHub mostrará o link e o token corretos para o seu repositório.

4. **Deixe o runner rodando**
   - Mantenha o terminal aberto com o comando `./run.sh` para que o runner aceite jobs.
   - Para rodar em background, use `./run.sh &` ou configure como serviço (veja docs do GitHub).

5. **Pronto!**
   - O runner aparecerá na lista de runners do repositório e poderá ser usado por qualquer colaborador.

> Para mais detalhes, consulte: https://docs.github.com/pt/actions/hosting-your-own-runners/adding-self-hosted-runners

## Resultados Alcançados

- Relatórios Playwright agora são gerados e publicados corretamente, tanto localmente quanto via pipeline.
- Relatório customizado exibe corretamente o relatório Playwright via link/iframe.
- Testes falhos e evidências são registrados e publicados.
- Processo de onboarding para novos membros documentado e facilitado.
- Pipeline robusta, com execução garantida mesmo em caso de falhas nos testes.

## Próximos Passos

- Monitorar o uso do runner self-hosted e considerar adicionar mais runners conforme a equipe cresce.
- Manter a documentação atualizada conforme novos fluxos ou ferramentas forem adotados.
- Incentivar feedback dos colaboradores para aprimorar ainda mais o processo.

---

**Resumo:**
O time avançou significativamente na automação, publicação e colaboração dos testes Playwright, tornando o processo mais transparente, acessível e robusto para todos os envolvidos.
