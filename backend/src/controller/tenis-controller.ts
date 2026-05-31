import { Request, Response } from "express";
import { TenisService } from "../service/tenis-service";

export class TenisController {
  constructor(private service: TenisService) {}

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

  private montarPayload(req: Request): Record<string, unknown> {
    const body = req.body ?? {};

    const arquivo = req.file as Express.Multer.File | undefined;
    const imagemUrl = arquivo ? `/uploads/${arquivo.filename}` : body.imagemUrl;

    return {
      ...body,
      preco: body.preco !== undefined ? Number(body.preco) : body.preco,
      tamanho: body.tamanho !== undefined ? Number(body.tamanho) : body.tamanho,
      estoque: body.estoque !== undefined ? Number(body.estoque) : body.estoque,
      categoriaId:
        body.categoriaId !== undefined ? Number(body.categoriaId) : body.categoriaId,
      imagemUrl,
    };
  }

  inserir = async (req: Request, res: Response): Promise<void> => {
    try {
      const payload = this.montarPayload(req);
      const tenis = await this.service.inserir(payload as any);

      res.status(201).json({
        mensagem: "Tênis cadastrado com sucesso",
        dados: tenis,
      });
    } catch (erro: unknown) {
      this.tratarErro(res, erro);
    }
  };

  listar = async (_req: Request, res: Response): Promise<void> => {
    try {
      const tenis = await this.service.listar();

      res.status(200).json({
        quantidade: tenis.length,
        dados: tenis,
      });
    } catch (erro: unknown) {
      this.tratarErro(res, erro);
    }
  };

  buscarPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      this.validarId(id);

      const tenis = await this.service.buscarPorId(id);

      res.status(200).json({
        dados: tenis,
      });
    } catch (erro: unknown) {
      this.tratarErro(res, erro);
    }
  };

  atualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      this.validarId(id);

      const payload = this.montarPayload(req);
      const tenis = await this.service.atualizar(id, payload as any);

      res.status(200).json({
        mensagem: "Tênis atualizado com sucesso",
        dados: tenis,
      });
    } catch (erro: unknown) {
      this.tratarErro(res, erro);
    }
  };

  partialUpdate = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      this.validarId(id);

      const payload = this.montarPayload(req);
      const tenis = await this.service.atualizar(id, payload as any);

      res.status(200).json({
        mensagem: "Tênis atualizado parcialmente com sucesso",
        dados: tenis,
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