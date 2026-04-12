import { Produto } from "../model/produto";
import pool from "./bd";
import { ProdutoRepository } from "./produto-repository";

export class ProdutoRepositoryPg implements ProdutoRepository{

    async inserir(produto: Omit<Produto, 'id'>): Promise<Produto> {
        const cliente = await pool.connect();

        const sql = `INSERT INTO produtos(nome, preco) VALUES ($1, $2) RETURNING *`;

        const resultado = await cliente.query(sql, [produto.nome, produto.preco]);
        cliente.release();

        return resultado.rows[0];
    }

    async listar(): Promise<Produto[]> {
        const cliente = await pool.connect();
        const sql = `SELECT * FROM PRODUTOS ORDER BY id`;

        const resultado = await cliente.query(sql);
        cliente.release();

        return resultado.rows;
    }

    async buscarPorId(id: number): Promise<Produto | undefined> {
        const cliente = await pool.connect();
        const sql = `SELECT * FROM PRODUTOS WHERE id=$1`;

        const resultado = await cliente.query(sql, [id]);
        cliente.release();

        return resultado.rows[0];
    }

    async atualizar(id: number, produto: Produto): Promise<Produto | undefined> {
        const cliente = await pool.connect();
        const sql = 'UPDATE produtos set nome=$1, preco=$2 WHERE id=$3 RETURNING *'
        const values = [produto.nome, produto.preco, id];

        const resultado = await cliente.query(sql, values);
        cliente.release();

        return resultado.rows[0];
    }

    async deletar(id: number): Promise<Produto | undefined> {
        const cliente = await pool.connect();
        const sql = `DELETE FROM PRODUTOS WHERE id=$1`;

        const resultado = await cliente.query(sql, [id]);
        cliente.release();

        return resultado.rows[0];
    }
}