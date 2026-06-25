import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Pedido } from "../model/pedido";

export class PedidoRepository {
  private repository: Repository<Pedido>;

  constructor() {
    this.repository = AppDataSource.getRepository(Pedido);
  }

  async inserir(pedido: Pedido): Promise<Pedido> {
    const pedidoSalvo = await this.repository.save(pedido);
    const pedidoCompleto = await this.buscarPorId(pedidoSalvo.id);

    if (!pedidoCompleto) {
      throw new Error("500|Pedido criado, mas não foi possível carregá-lo");
    }

    return pedidoCompleto;
  }

  async listar(): Promise<Pedido[]> {
    return this.repository.find({
      relations: ["usuario", "itens", "itens.tenis"],
      order: { id: "DESC" },
    });
  }

  async buscarPorId(id: number): Promise<Pedido | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["usuario", "itens", "itens.tenis"],
    });
  }

  async listarPorUsuario(usuarioId: number): Promise<Pedido[]> {
    return this.repository.find({
      where: {
        usuario: { id: usuarioId },
      },
      relations: ["usuario", "itens", "itens.tenis"],
      order: { id: "DESC" },
    });
  }

  async atualizar(id: number, dados: Partial<Pedido>): Promise<Pedido> {
    const pedidoExistente = await this.buscarPorId(id);
    if (!pedidoExistente) {
      throw new Error("404|Pedido não encontrado");
    }

    Object.assign(pedidoExistente, dados);
    return this.repository.save(pedidoExistente);
  }

  async deletar(id: number): Promise<void> {
    const pedidoExistente = await this.buscarPorId(id);
    if (!pedidoExistente) {
      throw new Error("404|Pedido não encontrado");
    }

    await this.repository.remove(pedidoExistente);
  }
}
