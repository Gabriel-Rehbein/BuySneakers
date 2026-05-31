# BuySneakers API

API RESTful desenvolvida com **Node.js + TypeScript + Express + TypeORM + PostgreSQL**, focada no gerenciamento completo de uma loja de tenis.

## Estrutura

```txt
backend/   API Node.js + TypeScript
frontend/  Aplicacao web
```

## Tecnologias utilizadas

* Node.js
* TypeScript
* Express
* TypeORM
* PostgreSQL
* JWT
* Bcrypt
* Multer

## Funcionalidades

### Categorias

* Criar categoria
* Listar categorias
* Buscar por ID
* Atualizar
* Deletar

### Tenis

* CRUD completo
* Upload de imagem
* Relacionamento com categoria

### Usuarios

* Cadastro de usuario
* Login com JWT
* Senha criptografada

### Pedidos

* Criar pedido
* Calculo automatico de total
* Controle de estoque
* Listar pedidos
* Listar pedidos do usuario

## Autenticacao

A API utiliza **JWT**.

Login:

```http
POST /api/auth/login
```

Header necessario:

```http
Authorization: Bearer SEU_TOKEN
```

## Upload de imagem

Endpoint:

```http
POST /api/tenis
```

Tipo:

```http
multipart/form-data
```

Campo:

```txt
imagem
```

As imagens ficam disponiveis em:

```http
http://localhost:3000/uploads/NOME_DA_IMAGEM
```

No projeto, elas sao armazenadas em:

```txt
backend/uploads/
```

## Instalacao

Clone o projeto:

```bash
git clone https://github.com/Gabriel-Rehbein/BuySneakers.git
cd BuySneakers
```

Instale as dependencias do backend:

```bash
cd backend
npm install
```

Configure o banco no arquivo:

```txt
backend/.env
```

Exemplo:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=buysneakers
```

O TypeORM cria automaticamente o banco configurado em `DB_NAME`, caso ele ainda nao exista, e cria/atualiza as tabelas com `synchronize: true`.

## Rodar o projeto

Backend:

```bash
cd backend
npm run dev
```

Servidor:

```txt
http://localhost:3000
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Rotas principais

### Auth

* POST `/api/auth/registrar`
* POST `/api/auth/login`

### Categorias

* GET `/api/categorias`
* GET `/api/categorias/:id`
* POST `/api/categorias`
* PUT `/api/categorias/:id`
* DELETE `/api/categorias/:id`

### Tenis

* GET `/api/tenis`
* GET `/api/tenis/:id`
* POST `/api/tenis`
* PUT `/api/tenis/:id`
* DELETE `/api/tenis/:id`

### Pedidos

* GET `/api/pedidos`
* GET `/api/pedidos/meus`
* GET `/api/pedidos/:id`
* POST `/api/pedidos`

## Regras de negocio

* Nao permite estoque negativo
* Nao permite preco negativo
* Nao permite pedido sem itens
* Nao permite comprar mais que o estoque
* Atualiza estoque automaticamente
* Calcula total do pedido
* Mantem historico de preco no pedido

## Autor

Gabriel Menezes Rehbein  
Bruno Beheregaray  
GitHub: https://github.com/Gabriel-Rehbein
