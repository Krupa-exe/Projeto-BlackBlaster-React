# 🎬 BlackBlaster

> Plataforma de aluguel de filmes online desenvolvida em React.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?style=flat&logo=reactrouter)
![CSS3](https://img.shields.io/badge/CSS3-Customizado-1572B6?style=flat&logo=css3)

---

## 📋 Sobre o Projeto

O **BlackBlaster** é uma aplicação web de aluguel de filmes com tema cinematográfico — paleta escura com vermelho sangue. O usuário pode navegar pelo catálogo, filtrar filmes por gênero, adicionar ao carrinho, se cadastrar com validação de CPF e conhecer a equipe por trás do projeto.

---

## ✨ Funcionalidades

- 🏠 **Home** — Apresentação da plataforma, seção "Como Funciona" e planos disponíveis
- 🎥 **Catálogo de Filmes** — 15 filmes organizados em 6 gêneros, com filtro e ordenação alfabética
- 🛒 **Carrinho** — Adição e remoção de filmes, cálculo de total e finalização de pedido
- 📝 **Cadastro** — Formulário com validação completa: nome, e-mail, CPF (Módulo 11), plano e termos
- 👥 **Equipe** — Apresentação dos desenvolvedores com avatar, cargo e links para LinkedIn e GitHub

---

## 🗂️ Estrutura do Projeto

```
src/
├── pages/
│   ├── Home.js
│   ├── FilmesPage.js
│   ├── CarrinhoPage.js
│   ├── CadastroPage.js
│   └── EquipePage.js
├── components/
│   ├── Layout.js
│   ├── CartaoFilme.js
│   ├── ItemCarrinho.js
│   ├── Equipe.js
│   ├── Sobre.js
│   └── Social.js
├── services/
│   └── cadastroServices.js
├── index.css
└── App.js
```

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

Instale uma vez só antes de começar:

- [Node.js](https://nodejs.org) — baixe a versão LTS
- [MySQL](https://dev.mysql.com/downloads/mysql) — ou via XAMPP se já tiver

Confirme a instalação no terminal:

```bash
node -v
npm -v
```

---

### Passo 1 — Configurar o banco

Abra o MySQL Workbench e conecte no seu servidor local.

Antes de executar o schema, gere o hash da senha do admin:

```bash
cd Backend
node -e "const b = require('bcryptjs'); console.log(b.hashSync('admin123', 10));"
```

Copie o resultado, abra o `schema.sql`, substitua `COLE_O_HASH_AQUI` pelo hash gerado e execute o arquivo no Workbench.

---

### Passo 2 — Configurar o .env

Na pasta `Backend`, abra o arquivo `.env` e preencha:

```env
SECRET_KEY=qualquer-frase-longa-aqui
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_do_mysql
DB_NAME=blackblaster
```

---

### Passo 3 — Instalar dependências

**Terminal 1 — Backend:**

```bash
cd Backend
npm install
```

**Terminal 2 — Frontend:**

```bash
cd seu-projeto-react
npm install
```

---

### Passo 4 — Rodar

Você precisa de **dois terminais abertos ao mesmo tempo.**

**Terminal 1 — Backend:**

```bash
cd Backend
node server.js
```

> Deve aparecer: `Servidor rodando na porta 3001`

**Terminal 2 — Frontend:**

```bash
cd seu-projeto-react
npm start
```

> Abre automaticamente em [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|---|---|
| React 19 | Biblioteca principal |
| React Router DOM 7 | Navegação entre páginas |
| React Icons | Ícones de LinkedIn e GitHub |
| CSS3 com variáveis | Estilização customizada |
| Create React App | Estrutura inicial do projeto |

---

## 👥 Equipe

| Nome | GitHub |
|---|---|
| Andrey Nery Lima Bonat | [@andrey_bonat](https://github.com/andrey_bonat) |
| Arthur Albert Schmaiske Quoos | [@arthur_quoos](https://github.com/arthur_quoos) |
| Eric Tan Hui Zhen | [@eric_zhen](https://github.com/eric_zhen) |
| João Vitor Krupa Inglês | [@joao_ingles](https://github.com/joao_ingles) |
| João Vitor Zambão | [@joao_zambao](https://github.com/joao_zambao) |