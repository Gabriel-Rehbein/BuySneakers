# 🚀 Como rodar o projeto BuySneakers

## 1. Abrar o projeto

No terminal, entre na pasta:

```bash
cd BuySneakers
```

---

## 2. Instalar dependências

```bash
npm install
```

---

## 3. Configurar o banco de dados

Abra o arquivo:

```txt
.env
```

Configure conforme seu PostgreSQL:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=buysneakers
```

O projeto usa TypeORM para criar automaticamente o banco `DB_NAME`, caso ele ainda não exista, e também cria/atualiza as tabelas com `synchronize: true`.

---

## 4. Rodar o projeto

```bash
npm run dev
```

---

## 5. Testar se está funcionando

Abra no navegador:

```txt
http://localhost:3000/hello
```

Resposta esperada:

```json
{
  "message": "BuySneakers API funcionando",
  "conceitos": ["C", "B", "A"]
}
```

---

## 6. Upload de imagens

As imagens ficam em:

```txt
uploads/
```

E podem ser acessadas por:

```txt
http://localhost:3000/uploads/nome-da-imagem
```

---

## 7. Problemas comuns

### ❌ Erro de dependências

```bash
npm install
```

### ❌ Erro de banco

* Verifique se o PostgreSQL está rodando
* Verifique usuário/senha
* Verifique se o usuário do PostgreSQL tem permissão para criar banco

### ❌ Porta ocupada

Altere no `app.ts`:

```ts
const port = 3000;
```

---

## 8. Resumo rápido

```bash
npm install
npm run dev
```

---

## ✅ Pronto!

Agora a API está rodando 🚀
