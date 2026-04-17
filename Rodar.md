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
src/data-source.ts
```

Configure conforme seu PostgreSQL:

```ts
host: "localhost",
port: 5432,
username: "postgres",
password: "sua_senha",
database: "buysneakers",
```

Crie o banco no PostgreSQL:

```sql
CREATE DATABASE buysneakers;
```

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
* Verifique se o banco existe

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
