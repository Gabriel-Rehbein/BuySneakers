# 👟 BuySneakers API

API RESTful desenvolvida com **Node.js + TypeScript + Express + TypeORM + PostgreSQL**, focada no gerenciamento completo de uma loja de tênis.

---

# 🚀 Tecnologias utilizadas

* Node.js
* TypeScript
* Express
* TypeORM
* PostgreSQL
* JWT (Autenticação)
* Bcrypt (Criptografia)
* Multer (Upload de imagens)

---

# 📦 Funcionalidades

## 🔹 Categorias

* Criar categoria
* Listar categorias
* Buscar por ID
* Atualizar
* Deletar

## 🔹 Tênis

* CRUD completo
* Upload de imagem
* Relacionamento com categoria

## 🔹 Usuários

* Cadastro de usuário
* Login com JWT
* Senha criptografada

## 🔹 Pedidos (E-commerce)

* Criar pedido
* Cálculo automático de total
* Controle de estoque
* Listar pedidos
* Listar pedidos do usuário

---

# 🔐 Autenticação

A API utiliza **JWT**.

### Login

```http
POST /api/auth/login
```

### Header necessário

```http
Authorization: Bearer SEU_TOKEN
```

---

# 🖼️ Upload de imagem

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

As imagens ficam disponíveis em:

```http
http://localhost:3000/uploads/NOME_DA_IMAGEM
```

---

# 🛒 Regras de negócio

* Não permite estoque negativo
* Não permite preço negativo
* Não permite pedido sem itens
* Não permite comprar mais que o estoque
* Atualiza estoque automaticamente
* Calcula total do pedido
* Mantém histórico de preço no pedido

---

# ⚙️ Instalação

## 1. Clonar o projeto

```bash
git clone https://github.com/Gabriel-Rehbein/BuySneakers.git
cd BuySneakers
```

## 2. Instalar dependências

```bash
npm install
```

## 3. Configurar banco

Edite o arquivo:

```ts
src/data-source.ts
```

Configure:

```ts
host: "localhost",
port: 5432,
username: "postgres",
password: "sua_senha",
database: "buysneakers",
```

---

## 4. Rodar o projeto

```bash
npm run dev
```

Servidor:

```txt
http://localhost:3000
```

---

# 📡 Rotas principais

## 🔐 Auth

* POST `/api/auth/registrar`
* POST `/api/auth/login`

## 📦 Categorias

* GET `/api/categorias`
* GET `/api/categorias/:id`
* POST `/api/categorias` 🔒
* PUT `/api/categorias/:id` 🔒
* DELETE `/api/categorias/:id` 🔒

## 👟 Tênis

* GET `/api/tenis`
* GET `/api/tenis/:id`
* POST `/api/tenis` 🔒
* PUT `/api/tenis/:id` 🔒
* DELETE `/api/tenis/:id` 🔒

## 🛒 Pedidos

* GET `/api/pedidos` 🔒
* GET `/api/pedidos/meus` 🔒
* GET `/api/pedidos/:id` 🔒
* POST `/api/pedidos` 🔒

---

# 🧪 Testes (Opcional - Conceito A)

Para rodar testes:

```bash
npm install -D jest ts-jest @types/jest
```

---

# 🧠 Conceitos aplicados

## ✔ Conceito C

* CRUD completo
* API REST
* Status HTTP corretos
* Arquitetura em camadas

## ✔ Conceito B

* Relacionamento entre entidades
* Autenticação JWT
* Segurança com bcrypt
* Estrutura organizada

## ✔ Conceito A

* Upload de imagem (mídia)
* Regras de negócio completas
* Tratamento de erros
* Sistema de pedidos (e-commerce)

---

# 👨‍💻 Autor

Gabriel Menezes Rehbein
Bruno Beheregaray
GitHub: https://github.com/Gabriel-Rehbein

---

# 📌 Status

✅ Projeto completo
🔥 Nível: Conceito A
