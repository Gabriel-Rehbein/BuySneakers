import { Request, Response } from "express";
import { CategoriaService } from "../service/categoria-service";

export class CategoriaController {
  constructor(private service: CategoriaService) {}

  private tratarErro(res: Response, erro: any): void {
    if (erro?.id || erro?.msg) {
      res.status(erro.id || 500).json({
        erro: erro.msg || "Erro interno no servidor",
      });
      return;
    }

    const [status, mensagem] = erro?.message?.split("|") || [];
    res.status(Number(status) || 500).json({
      erro: mensagem || "Erro interno no servidor",
    });
  }

  inserir = async (req: Request, res: Response): Promise<void> => {
    try {
      const categoria = await this.service.inserir(req.body);
      res.status(201).json(categoria);
    } catch (erro: any) {
      this.tratarErro(res, erro);
    }
  };

  listar = async (_req: Request, res: Response): Promise<void> => {
    try {
      const categorias = await this.service.listar();
      res.status(200).json(categorias);
    } catch (erro: any) {
      this.tratarErro(res, erro);
    }
  };

  buscarPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const categoria = await this.service.buscarPorId(Number(req.params.id));
      res.status(200).json(categoria);
    } catch (erro: any) {
      this.tratarErro(res, erro);
    }
  };

  atualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const categoria = await this.service.atualizar(Number(req.params.id), req.body);
      res.status(200).json(categoria);
    } catch (erro: any) {
      this.tratarErro(res, erro);
    }
  };

  deletar = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.service.deletar(Number(req.params.id));
      res.status(204).send();
    } catch (erro: any) {
      this.tratarErro(res, erro);
    }
  };
}