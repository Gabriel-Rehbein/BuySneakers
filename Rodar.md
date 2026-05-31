# Como rodar o projeto BuySneakers

## 1. Abrir o projeto

No terminal, entre na pasta:

```bash
cd BuySneakers
```

## 2. Rodar o backend

O backend agora fica dentro da pasta `backend`.

```bash
cd backend
npm install
npm run dev
```

## 3. Configurar o banco de dados

Abra o arquivo:

```txt
backend/.env
```

Configure conforme seu PostgreSQL:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=buysneakers
```

O projeto usa TypeORM para criar automaticamente o banco `DB_NAME`, caso ele ainda nao exista, e tambem cria/atualiza as tabelas com `synchronize: true`.

## 4. Testar se esta funcionando

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

## 5. Upload de imagens

As imagens do backend ficam em:

```txt
backend/uploads/
```

E podem ser acessadas por:

```txt
http://localhost:3000/uploads/nome-da-imagem
```

## 6. Rodar o frontend

Em outro terminal, a partir da raiz do projeto:

```bash
cd frontend
npm install
npm run dev
```

## 7. Resumo rapido

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```
