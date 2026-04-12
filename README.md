# 👟 BuySneakers API

API RESTful desenvolvida em **Node.js + TypeScript + Express + TypeORM + PostgreSQL** para gerenciamento de uma loja de tênis.

---

## 🚀 Objetivo do Projeto

Este projeto foi desenvolvido para atender aos requisitos do **Conceito C**, incluindo:

* ✔ Dois CRUDs completos
* ✔ Persistência de dados com banco real
* ✔ Relacionamento entre entidades (Many-to-One)
* ✔ Uso correto de API RESTful
* ✔ Organização em camadas (Controller, Service, Repository)
* ✔ Testes via Insomnia/Postman

---

## 🧠 Entidades

### 📦 Categoria

* id
* nome
* descricao

### 👟 Tênis

* id
* nome
* marca
* cor
* preco
* tamanho
* estoque
* categoria (relacionamento)

---

## 🔗 Relacionamento

* **Many-to-One**
* Muitos tênis pertencem a uma categoria

---

## 📁 Estrutura do Projeto

```
src/
├── app.ts
├── data-source.ts
├── model/
├── repository/
├── service/
├── controller/
└── router/
```

---

## ⚙️ Tecnologias Utilizadas

* Node.js
* TypeScript
* Express
* TypeORM
* PostgreSQL

---

## 📦 Instalação

### 1. Clonar o projeto

```bash
git clone <seu-repositorio>
cd buysneakers-api
```

### 2. Instalar dependências

```bash
npm install
```

Caso necessário:

```bash
npm install express typeorm reflect-metadata pg
npm install -D typescript ts-node-dev @types/node @types/express
```

---

## 🗄️ Banco de Dados

Crie o banco no PostgreSQL:

```sql
CREATE DATABASE buysneakers;
```

---

## 🔧 Configuração

Edite o arquivo `data-source.ts`:

```ts
username: "postgres",
password: "senacrs",
database: "buysneakers"
```

---

## ▶️ Como Rodar o Projeto

### Modo desenvolvimento

```bash
npx ts-node-dev src/app.ts
```

ou

```bash
npm run dev
```

---

## 🌐 Teste no Navegador

Acesse:

```
http://localhost:3000/hello
```

Resposta esperada:

```json
{
  "message": "BuySneakers API funcionando"
}
```

---

## 🔥 Endpoints

### 📦 Categorias

#### Criar

```
POST /api/categorias
```

```json
{
  "nome": "Corrida",
  "descricao": "Tênis esportivos"
}
```

---

#### Listar

```
GET /api/categorias
```

---

#### Buscar por ID

```
GET /api/categorias/1
```

---

#### Atualizar

```
PUT /api/categorias/1
```

---

#### Deletar

```
DELETE /api/categorias/1
```

---

### 👟 Tênis

#### Criar

```
POST /api/tenis
```

```json
{
  "nome": "Air Max",
  "marca": "Nike",
  "cor": "Preto",
  "preco": 500,
  "tamanho": 42,
  "estoque": 5,
  "categoriaId": 1
}
```

---

#### Listar

```
GET /api/tenis
```

---

#### Buscar por ID

```
GET /api/tenis/1
```

---

#### Atualizar

```
PUT /api/tenis/1
```

---

#### Deletar

```
DELETE /api/tenis/1
```

---

## 🧪 Testes

Utilize ferramentas como:

* Insomnia
* Postman

Teste:

* criação
* listagem
* busca
* atualização
* exclusão
* erros (400 / 404)

---

## 📌 Status Code Utilizados

* `200` OK
* `201` Criado
* `204` Sem conteúdo
* `400` Erro de validação
* `404` Não encontrado
* `500` Erro interno

---

## 🧩 Funcionalidade com Duas Entidades

Ao criar um tênis, é necessário informar:

```
categoriaId
```

Isso garante:

* validação da categoria
* relacionamento correto entre entidades

---

## 🔄 Controle de Versão

Utilize Git:

```bash
git init
git add .
git commit -m "feat: inicialização do projeto BuySneakers"
```

Sugestões de commits:

* feat: CRUD categorias
* feat: CRUD tenis
* feat: relacionamento many-to-one
* fix: validações

---

## 💡 Ideias para melhorias

* Adicionar upload de imagem
* Criar autenticação (login)
* Paginação
* Filtro por categoria
* Controle de estoque automático

---

## 👨‍💻 Autor

Gabriel

---

## 📄 Licença

Projeto acadêmico para fins educacionais.

npm run dev
