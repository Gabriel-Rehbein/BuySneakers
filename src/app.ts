import express, { Request, Response } from 'express';
import { produtoRotas } from './router/produto-router';
import { ProdutoController } from './controller/produto-controller';
import { ProdutoService } from './service/produto-service';
import { ProdutoRepositoryMem } from './repository/produto-repository-mem';
const app = express();
const port = 3000;
app.use(express.json());

app.get('/hello', (req: Request, res: Response) => {
 res.json({ message: "Hello World!!" });
})

app.use('/uploads', express.static('my-uploads'))


//Inicializacao das dependencias
const produtoRepository = new ProdutoRepositoryMem();
const produtoService = new ProdutoService(produtoRepository);
const produtoController = new ProdutoController(produtoService);

app.use('/api/produtos', produtoRotas(produtoController))

app.listen(port, () => {
 console.log(`Servidor rodando em http://localhost:${port}`);
});
