import { Produto } from "../model/produto";

export interface ProdutoRepository {
    inserir(produto: Omit<Produto, 'id'>): Promise<Produto>; 
    listar(): Promise<Produto[]>;
    buscarPorId(id: number): Promise<Produto | undefined>;
    atualizar(id: number, produto: Produto): Promise<Produto | undefined>;
    deletar(id: number): Promise<Produto | undefined>;
}