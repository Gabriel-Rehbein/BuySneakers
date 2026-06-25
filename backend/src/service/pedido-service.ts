import { ItemPedido } from "../model/item-pedido";
import { Pedido } from "../model/pedido";
import { PedidoRepository } from "../repository/pedido-repository";
import { TenisRepository } from "../repository/tenis-repository";
import { UsuarioRepository } from "../repository/usuario-repository";

type ItemInput = {
  tenisId: number;
  quantidade: number;
};

type PedidoInput = {
  usuarioId: number;
  itens: ItemInput[];
};

export class PedidoService {
  constructor(
    private pedidoRepository: PedidoRepository,
    private usuarioRepository: UsuarioRepository,
    private tenisRepository: TenisRepository
  ) {}

  private validarId(id: number, nome: string): void {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(`400|${nome} inválido`);
    }
  }

  private async buscarPedidoDoUsuario(pedidoId: number, usuarioId: number): Promise<Pedido> {
    this.validarId(pedidoId, "Pedido");
    this.validarId(usuarioId, "Usuário");

    const pedido = await this.buscarPorId(pedidoId);

    if (pedido.usuario.id !== usuarioId) {
      throw new Error("403|Você não pode alterar este pedido");
    }

    return pedido;
  }

  async criar(dados: PedidoInput): Promise<Pedido> {
    this.validarId(dados.usuarioId, "Usuário");

    if (!Array.isArray(dados.itens) || dados.itens.length === 0) {
      throw new Error("400|O pedido deve ter pelo menos um item");
    }

    const usuario = await this.usuarioRepository.buscarPorId(dados.usuarioId);
    if (!usuario) {
      throw new Error("404|Usuário não encontrado");
    }

    const pedido = new Pedido();
    pedido.usuario = usuario;
    pedido.itens = [];
    pedido.total = 0;

    for (const itemInput of dados.itens) {
      this.validarId(itemInput.tenisId, "Tênis");

      if (!Number.isInteger(itemInput.quantidade) || itemInput.quantidade <= 0) {
        throw new Error("400|Quantidade inválida");
      }

      const tenis = await this.tenisRepository.buscarPorId(itemInput.tenisId);
      if (!tenis) {
        throw new Error("404|Tênis não encontrado");
      }

      if (tenis.estoque < itemInput.quantidade) {
        throw new Error(
          `400|Estoque insuficiente para o tênis ${tenis.nome}`
        );
      }

      tenis.estoque -= itemInput.quantidade;
      await this.tenisRepository.atualizar(tenis.id, tenis);

      const item = new ItemPedido();
      item.pedido = pedido;
      item.tenis = tenis;
      item.quantidade = itemInput.quantidade;
      item.precoUnitario = Number(tenis.preco);
      item.subtotal = Number(tenis.preco) * itemInput.quantidade;

      pedido.itens.push(item);
      pedido.total += item.subtotal;
    }

    return this.pedidoRepository.inserir(pedido);
  }

  async listar(): Promise<Pedido[]> {
    return this.pedidoRepository.listar();
  }

  async buscarPorId(id: number): Promise<Pedido> {
    this.validarId(id, "Pedido");

    const pedido = await this.pedidoRepository.buscarPorId(id);
    if (!pedido) {
      throw new Error("404|Pedido não encontrado");
    }

    return pedido;
  }

  async listarPorUsuario(usuarioId: number): Promise<Pedido[]> {
    this.validarId(usuarioId, "Usuário");
    return this.pedidoRepository.listarPorUsuario(usuarioId);
  }

  async atualizar(id: number, dados: Partial<Pedido>): Promise<Pedido> {
    this.validarId(id, "Pedido");

    const pedidoExistente = await this.buscarPorId(id);

    // Para simplicidade, permitir atualizar apenas campos simples, não itens
    if (dados.total !== undefined || dados.itens !== undefined) {
      throw new Error("400|Não é possível atualizar total ou itens do pedido");
    }

    Object.assign(pedidoExistente, dados);
    return this.pedidoRepository.atualizar(id, pedidoExistente);
  }

  async atualizarQuantidadeItem(
    pedidoId: number,
    itemId: number,
    usuarioId: number,
    quantidade: number
  ): Promise<Pedido> {
    this.validarId(itemId, "Item do pedido");

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      throw new Error("400|Quantidade inválida");
    }

    const pedido = await this.buscarPedidoDoUsuario(pedidoId, usuarioId);
    const item = pedido.itens?.find((itemPedido) => itemPedido.id === itemId);

    if (!item) {
      throw new Error("404|Item do pedido não encontrado");
    }

    const diferenca = quantidade - item.quantidade;

    if (diferenca > 0 && item.tenis.estoque < diferenca) {
      throw new Error(`400|Estoque insuficiente para o tênis ${item.tenis.nome}`);
    }

    item.tenis.estoque -= diferenca;
    await this.tenisRepository.atualizar(item.tenis.id, item.tenis);

    item.quantidade = quantidade;
    item.subtotal = Number(item.precoUnitario) * quantidade;
    pedido.total =
      pedido.itens?.reduce((total, itemPedido) => total + Number(itemPedido.subtotal), 0) ?? 0;

    return this.pedidoRepository.atualizar(pedido.id, pedido);
  }

  async deletar(id: number, usuarioId?: number): Promise<void> {
    const pedido = usuarioId
      ? await this.buscarPedidoDoUsuario(id, usuarioId)
      : await this.buscarPorId(id);

    for (const item of pedido.itens ?? []) {
      item.tenis.estoque += item.quantidade;
      await this.tenisRepository.atualizar(item.tenis.id, item.tenis);
    }

    await this.pedidoRepository.deletar(id);
  }
}
