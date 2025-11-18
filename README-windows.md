# Guia Rápido: Rodando o projeto Doc+Simples no Windows

Este guia é para quem deseja clonar o repositório e rodar os testes localmente em ambiente Windows.

## Pré-requisitos
- **Git** instalado ([download](https://git-scm.com/download/win))
- **Node.js** (versão 18+) e **npm** ([download](https://nodejs.org/))
- **Python 3** (opcional, para servir relatórios locais)
- **VS Code** (opcional, recomendado)

## Passos para rodar os testes

### 1. Clonar o repositório
Abra o terminal (Prompt de Comando ou PowerShell) e execute:
```sh
git clone https://github.com/OrquestraIA/TestsDoc-Simples.git
cd TestsDoc-Simples
```

### 2. Instalar dependências
```sh
npm install
```

### 3. Configurar variáveis de ambiente
- Copie o arquivo `.env.example` para `.env`:
```sh
copy .env.example .env
```
- Edite o `.env` (usuário, senha, BASE_URL).

### 4. Rodar os testes Playwright
- Para rodar todos os testes:
```sh
npx playwright test
```
- Para rodar um teste específico com interface (headed):
```sh
npx playwright test tests/physical-archive.spec.ts --headed
```

### 5. Gerar relatório customizado
```sh
npm run report:custom custom-report-dev
```

### 6. Visualizar o relatório
- Extraia a pasta do relatório, entre nela e rode:
```sh
python -m http.server 8080
```
- Acesse [http://localhost:8080](http://localhost:8080) e clique em `index.html`.
- Ou use o VS Code com a extensão Live Server (clique com o direito em `index.html` > Open with Live Server).

## Dicas
- Sempre rode o terminal como administrador se tiver problemas de permissão.
- Se der erro de porta ocupada, tente outra porta: `python -m http.server 8888`.
- Para dúvidas, consulte o README principal ou peça ajuda ao time.

---

**Doc+Simples | OrquestraIA**
