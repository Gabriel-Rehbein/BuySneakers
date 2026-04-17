import { Request, Response } from "express";
import { TenisService } from "../service/tenis-service";

export class TenisController {
  constructor(private service: TenisService) {}

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

  private validarId(id: number): void {
    if (isNaN(id) || id <= 0) {
      throw { id: 400, msg: "ID inválido" };
    }
  }

  inserir = async (req: Request, res: Response): Promise<void> => {
    try {
      const tenis = await this.service.inserir(req.body);
      res.status(201).json(tenis);
    } catch (erro: any) {
      this.tratarErro(res, erro);
    }
  };

  listar = async (_req: Request, res: Response): Promise<void> => {
    try {
      const tenis = await this.service.listar();
      res.status(200).json(tenis);
    } catch (erro: any) {
      this.tratarErro(res, erro);
    }
  };

  buscarPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      this.validarId(id);

      const tenis = await this.service.buscarPorId(id);
      res.status(200).json(tenis);
    } catch (erro: any) {
      this.tratarErro(res, erro);
    }
  };

  atualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      this.validarId(id);

      const tenis = await this.service.atualizar(id, req.body);
      res.status(200).json(tenis);
    } catch (erro: any) {
      this.tratarErro(res, erro);
    }
  };

  deletar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      this.validarId(id);

      await this.service.deletar(id);
      res.status(204).send();
    } catch (erro: any) {
      this.tratarErro(res, erro);
    }
  };
}