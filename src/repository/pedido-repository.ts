import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Pedido } from "../model/pedido";

export class PedidoRepository {
  private repository: Repository<Pedido>;

  constructor() {
    this.repository = AppDataSource.getRepository(Pedido);
  }

  async inserir(pedido: Pedido): Promise<Pedido> {
    return this.repository.save(pedido);
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
}