
# Vôlei Quinta - Firebase Project

https://voleidquinta.web.app/index.html

Este é um projeto que utiliza Firebase para a hospedagem e Firestore como banco de dados. A aplicação permite gerenciar pessoas, gastos, recebimentos e gerar relatórios de uma quadra de vôlei. Este arquivo `README.md` contém instruções sobre como configurar o ambiente local, rodar o emulador, e fazer o deploy para o Firebase Hosting.

## Estrutura do Projeto

```bash
/public
  /assets
    /css
      styles.css
    /js
      firebase-config.js
      index.js
      pessoas.js
      gastos.js
      recebimentos.js
      relatorios.js
      /components
        header.js
  index.html
  pessoas.html
  gastos.html
  recebimentos.html
  relatorios.html
```

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado em sua máquina.
- Uma conta no [Firebase](https://firebase.google.com/) e um projeto Firebase configurado.
- **Firebase CLI** instalado globalmente.

#### Instalar Firebase CLI

Se ainda não tiver o Firebase CLI instalado, execute o comando abaixo para instalá-lo globalmente:

```bash
npm install -g firebase-tools
```

### Configuração do Projeto

1. Clone este repositório em sua máquina local:

   ```bash
   git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   ```

2. Navegue até o diretório do projeto:

   ```bash
   cd voleidquinta
   ```

3. Faça login no Firebase usando a CLI:

   ```bash
   firebase login
   ```

4. Inicialize o Firebase no seu projeto (se necessário):

   ```bash
   firebase init
   ```

   Selecione **Firestore** e **Hosting** durante a configuração. Certifique-se de que o diretório público esteja configurado corretamente (geralmente `public/`).

### Variáveis de Ambiente

Para fins de segurança, as credenciais sensíveis, como as chaves da API, devem ser armazenadas em arquivos de ambiente, como `.env`, e não devem ser commitadas no Git. No entanto, neste projeto básico, as credenciais do Firebase estão no arquivo `firebase-config.js`.

### Comandos de Deploy do Firebase

1. **Deploy Completo**:
   
   Para enviar o projeto completo ao Firebase Hosting e Firestore:

   ```bash
   firebase deploy
   ```

2. **Deploy de Hospedagem (Hosting) Somente**:
   
   Para enviar apenas as mudanças do **hosting** (site):

   ```bash
   firebase deploy --only hosting
   ```

3. **Deploy de Outras Funcionalidades**:
   
   Se você adicionar funcionalidades como **Firestore Rules** ou **Functions**, poderá enviar mudanças específicas usando o comando `--only`:

   ```bash
   firebase deploy --only firestore
   firebase deploy --only functions
   ```

### Rodar o Firebase Emulator para Testes Locais

Para rodar o Firebase Emulator Suite localmente e testar a aplicação sem fazer deploy, use o comando abaixo:

```bash
firebase emulators:start
```

Isso iniciará o emulador do Firestore e do Hosting localmente, e você poderá acessá-los via `http://localhost:5000` ou na porta configurada no `firebase.json`.

### Como Utilizar o Projeto

1. Após o deploy, a aplicação estará disponível no Firebase Hosting e pronta para ser acessada.
2. O sistema inclui páginas para **Cadastro de Pessoas**, **Cadastro de Gastos**, **Cadastro de Recebimentos**, e **Relatórios**.
3. Cada funcionalidade pode ser acessada diretamente pelas URLs configuradas no projeto:

   - **Página Principal (Resumo Financeiro):** `/index.html`
   - **Cadastro de Pessoas:** `/pessoas.html`
   - **Cadastro de Gastos:** `/gastos.html`
   - **Cadastro de Recebimentos:** `/recebimentos.html`
   - **Relatórios:** `/relatorios.html`

### Estrutura de Arquivos

- **/assets/js/firebase-config.js:** Configura o Firebase e inicializa o Firestore.
- **/assets/js/index.js:** Manipula a lógica para o resumo financeiro da aplicação.
- **/assets/js/pessoas.js:** Gerencia o cadastro de pessoas.
- **/assets/js/gastos.js:** Gerencia o cadastro de gastos e entradas.
- **/assets/js/recebimentos.js:** Gerencia o cadastro de recebimentos.
- **/assets/js/relatorios.js:** Gera relatórios financeiros e de participação.
- **/assets/js/components/header.js:** Carrega o header de navegação dinamicamente em todas as páginas.

### Fluxo de Desenvolvimento com Branches

O projeto segue um fluxo de desenvolvimento utilizando duas branches principais:
- **main**: Contém a versão de produção do projeto.
- **dev**: Contém o código em desenvolvimento e testes.

**Recomendações:**

1. **Criar uma branch para cada funcionalidade:** Ao desenvolver uma nova funcionalidade, crie uma branch específica a partir de `dev`:

   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/nome-da-funcionalidade
   ```

2. **Fazer merge da funcionalidade na `dev` após testes:**

   ```bash
   git checkout dev
   git merge feature/nome-da-funcionalidade
   git push origin dev
   ```

3. **Promover para `main` após a finalização:** 

   ```bash
   git checkout main
   git merge dev
   git push origin main
   ```

### Dicas de Segurança

- Nunca faça commit de suas credenciais sensíveis, como chaves de API, em arquivos públicos. Utilize arquivos de ambiente `.env` ou o **Firebase Functions Config** para gerenciar variáveis sensíveis.

---

## Links Úteis

- [Documentação Firebase](https://firebase.google.com/docs)
- [Guia Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [GitHub do Projeto](https://github.com/ImFelipeAlexandre/voleidquinta/)
