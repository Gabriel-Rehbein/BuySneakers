import { Request, Response } from "express";
import { PedidoService } from "../service/pedido-service";

export class PedidoController {
  constructor(private service: PedidoService) {}

  private tratarErro(res: Response, erro: unknown): void {
    if (erro instanceof Error) {
      const [status, mensagem] = erro.message?.split("|") || [];
      res.status(Number(status) || 500).json({
        erro: mensagem || "Erro interno no servidor",
      });
      return;
    }

    res.status(500).json({ erro: "Erro interno no servidor" });
  }

  criar = async (req: Request, res: Response): Promise<void> => {
    try {
      const usuarioId = req.usuario?.id;

      const pedido = await this.service.criar({
        usuarioId: Number(usuarioId),
        itens: req.body.itens,
      });

      res.status(201).json({
        mensagem: "Pedido criado com sucesso",
        dados: pedido,
      });
    } catch (erro) {
      this.tratarErro(res, erro);
    }
  };

  listar = async (_req: Request, res: Response): Promise<void> => {
    try {
      const pedidos = await this.service.listar();

      res.status(200).json({
        quantidade: pedidos.length,
        dados: pedidos,
      });
    } catch (erro) {
      this.tratarErro(res, erro);
    }
  };

  buscarPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const pedido = await this.service.buscarPorId(Number(req.params.id));

      res.status(200).json({
        dados: pedido,
      });
    } catch (erro) {
      this.tratarErro(res, erro);
    }
  };

  meusPedidos = async (req: Request, res: Response): Promise<void> => {
    try {
      const usuarioId = Number(req.usuario?.id);
      const pedidos = await this.service.listarPorUsuario(usuarioId);

      res.status(200).json({
        quantidade: pedidos.length,
        dados: pedidos,
      });
    } catch (erro) {
      this.tratarErro(res, erro);
    }
  };

  atualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const pedido = await this.service.atualizar(id, req.body);

      res.status(200).json({
        mensagem: "Pedido atualizado com sucesso",
        dados: pedido,
      });
    } catch (erro) {
      this.tratarErro(res, erro);
    }
  };

  partialUpdate = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const pedido = await this.service.atualizar(id, req.body);

      res.status(200).json({
        mensagem: "Pedido atualizado parcialmente com sucesso",
        dados: pedido,
      });
    } catch (erro) {
      this.tratarErro(res, erro);
    }
  };

  atualizarQuantidadeItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const pedido = await this.service.atualizarQuantidadeItem(
        Number(req.params.id),
        Number(req.params.itemId),
        Number(req.usuario?.id),
        Number(req.body.quantidade)
      );

      res.status(200).json({
        mensagem: "Item do pedido atualizado com sucesso",
        dados: pedido,
      });
    } catch (erro) {
      this.tratarErro(res, erro);
    }
  };

  deletar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      await this.service.deletar(id, Number(req.usuario?.id));
      res.status(204).send();
    } catch (erro) {
      this.tratarErro(res, erro);
    }
  };
}
