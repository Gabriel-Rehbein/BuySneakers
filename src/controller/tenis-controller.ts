import { Request, Response } from "express";
import { TenisService } from "../service/tenis-service";

export class TenisController {
  constructor(private service: TenisService) {}

  inserir = async (req: Request, res: Response): Promise<void> => {
    try {
      const tenis = await this.service.inserir(req.body);
      res.status(201).json(tenis);
    } catch (erro: any) {
      res.status(erro.id || 500).json({ erro: erro.msg || "Erro interno no servidor" });
    }
  };

  listar = async (_req: Request, res: Response): Promise<void> => {
    try {
      const tenis = await this.service.listar();
      res.status(200).json(tenis);
    } catch {
      res.status(500).json({ erro: "Erro interno no servidor" });
    }
  };

  buscarPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const tenis = await this.service.buscarPorId(Number(req.params.id));
      res.status(200).json(tenis);
    } catch (erro: any) {
      res.status(erro.id || 500).json({ erro: erro.msg || "Erro interno no servidor" });
    }
  };

  atualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const tenis = await this.service.atualizar(Number(req.params.id), req.body);
      res.status(200).json(tenis);
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