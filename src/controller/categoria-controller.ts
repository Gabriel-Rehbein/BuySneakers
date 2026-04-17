import { Request, Response } from "express";
import { CategoriaService } from "../service/categoria-service";

export class CategoriaController {
  constructor(private service: CategoriaService) {}

  private tratarErro(res: Response, erro: unknown): void {
    if (
      typeof erro === "object" &&
      erro !== null &&
      "id" in erro &&
      "msg" in erro
    ) {
      const erroTipado = erro as { id?: number; msg?: string };

      res.status(erroTipado.id || 500).json({
        erro: erroTipado.msg || "Erro interno no servidor",
      });
      return;
    }

    if (erro instanceof Error) {
      const [status, mensagem] = erro.message?.split("|") || [];
      res.status(Number(status) || 500).json({
        erro: mensagem || "Erro interno no servidor",
      });
      return;
    }

    res.status(500).json({
      erro: "Erro interno no servidor",
    });
  }

  private validarId(id: number): void {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("400|ID inválido");
    }
  }

  inserir = async (req: Request, res: Response): Promise<void> => {
    try {
      const categoria = await this.service.inserir(req.body);

      res.status(201).json({
        mensagem: "Categoria cadastrada com sucesso",
        dados: categoria,
      });
    } catch (erro: unknown) {
      this.tratarErro(res, erro);
    }
  };

  listar = async (_req: Request, res: Response): Promise<void> => {
    try {
      const categorias = await this.service.listar();

      res.status(200).json({
        quantidade: categorias.length,
        dados: categorias,
      });
    } catch (erro: unknown) {
      this.tratarErro(res, erro);
    }
  };

  buscarPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      this.validarId(id);

      const categoria = await this.service.buscarPorId(id);

      res.status(200).json({
        dados: categoria,
      });
    } catch (erro: unknown) {
      this.tratarErro(res, erro);
    }
  };

  atualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      this.validarId(id);

      const categoria = await this.service.atualizar(id, req.body);

      res.status(200).json({
        mensagem: "Categoria atualizada com sucesso",
        dados: categoria,
      });
    } catch (erro: unknown) {
      this.tratarErro(res, erro);
    }
  };

  deletar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      this.validarId(id);

      await this.service.deletar(id);
      res.status(204).send();
    } catch (erro: unknown) {
      this.tratarErro(res, erro);
    }
  };
}