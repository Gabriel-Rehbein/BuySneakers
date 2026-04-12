import { Request, Response } from "express";
import { ProdutoService } from "../service/produto-service";

export class ProdutoController {
    private service: ProdutoService;

    constructor(service: ProdutoService) {
        this.service = service;

    }

     inserir = async(req: Request, res: Response): Promise<void> => {
        const produto = req.body;
        try {
            const novoProduto = await this.service.inserir(produto);
            res.status(201).json(novoProduto);
        }
        catch(err: any) {
            res.status(err.id).json({ error: err.msg});
        }
    }

    listar = async (_req: Request, res: Response): Promise<void> => {
        const listaProdutos = await this.service.listar();
        res.json(listaProdutos);
    }

    buscarPorId = async (req: Request, res: Response): Promise<void> => {
        const id = parseInt(req.params.id as string);

        try{
            const produto = await this.service.buscarPorId(id);
            res.json(produto);

        } catch (err: any) {
            res.status(err.id).json({ error: err.msg});            
        }
    }

    atualizar = async (req: Request, res: Response): Promise<void> => {
        const id = +req.params.id;
        let produto = req.body;
        try{
            res.json(await this.service.atualizar(id, produto));
        } catch(err: any) {
            res.status(err.id).json(err);
        }
    }

    deletar = async (req: Request, res: Response): Promise<void> => {
        const id = +req.params.id;
        try {
            res.json(await this.service.deletar(id));
        } catch(err: any) {
            res.status(err.id).json(err);
        }
    }
}