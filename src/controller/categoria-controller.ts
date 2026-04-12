import { Request, Response } from "express";
import { CategoriaService } from "../service/categoria-service";

export class CategoriaController {
  constructor(private service: CategoriaService) {}

  inserir = async (req: Request, res: Response): Promise<void> => {
    try {
      const categoria = await this.service.inserir(req.body);
      res.status(201).json(categoria);
    } catch (erro: any) {
      res.status(erro.id || 500).json({ erro: erro.msg || "Erro interno no servidor" });
    }
  };

  listar = async (_req: Request, res: Response): Promise<void> => {
    try {
      const categorias = await this.service.listar();
      res.status(200).json(categorias);
    } catch {
      res.status(500).json({ erro: "Erro interno no servidor" });
    }
  };

  buscarPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const categoria = await this.service.buscarPorId(Number(req.params.id));
      res.status(200).json(categoria);
    } catch (erro: any) {
      res.status(erro.id || 500).json({ erro: erro.msg || "Erro interno no servidor" });
    }
  };

  atualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const categoria = await this.service.atualizar(Number(req.params.id), req.body);
      res.status(200).json(categoria);
    } catch (erro: any) {
      res.status(erro.id || 500).json({ erro: erro.msg || "Erro interno no servidor" });
    }
  };

  deletar = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.service.deletar(Number(req.params.id));
      res.status(204).send();
    } catch (erro: any) {
      res.status(erro.id || 500).json({ erro: erro.msg || "Erro interno no servidor" });
    }
  };
}