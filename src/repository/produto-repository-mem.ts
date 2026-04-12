import { Produto } from "../model/produto";
import { ProdutoRepository } from "./produto-repository";

export class ProdutoRepositoryMem implements ProdutoRepository{
    listaProdutos: Produto[] = [];
    autoIncr = 1;

    async inserir(produto: Omit<Produto, 'id'>): Promise<Produto> {
        const novoProduto = { id: this.autoIncr++, ...produto };
        this.listaProdutos.push(novoProduto);
        return Promise.resolve(novoProduto);
    }

    async listar(): Promise<Produto[]> {
        return Promise.resolve(this.listaProdutos);
    }

    async buscarPorId(id: number): Promise<Produto | undefined> {
        return Promise.resolve(this.listaProdutos.find(
            function(produto: Produto) {
                return (produto.id === id);        
            }
        ));
    }

    async atualizar(id: number, data: Partial<Produto>): Promise<Produto | undefined> {
        const produto = await this.buscarPorId(id);
        let indiceProduto = this.listaProdutos.findIndex(
            produto => produto.id === id
        );

        if (!produto) {
            return Promise.resolve(undefined);
        }

        this.listaProdutos[indiceProduto] = Object.assign(produto, data);
        return Promise.resolve(produto);
    }

    async deletar(id: number): Promise<Produto | undefined> {
        let indiceProduto = this.listaProdutos.findIndex(
            produto => produto.id === id
        );
        if(indiceProduto >= 0) {
            let produtoRemovido = this.listaProdutos.splice(indiceProduto, 1)[0];
            return Promise.resolve(produtoRemovido);
        }
        return Promise.resolve(undefined);
    }
}