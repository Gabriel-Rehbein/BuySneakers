import { Categoria } from "../model/categoria";
import { CategoriaRepository } from "../repository/categoria-repository";

export class CategoriaService {
  constructor(private repository: CategoriaRepository) {}

  private validarId(id: number): void {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("400|ID da categoria inválido");
    }
  }

  async inserir(categoria: Categoria): Promise<Categoria> {
    if (!categoria?.nome?.trim()) {
      throw new Error("400|Nome da categoria é obrigatório");
    }

    if (categoria.descricao !== undefined && categoria.descricao !== null) {
      categoria.descricao = categoria.descricao.trim();
    }

    categoria.nome = categoria.nome.trim();

    return this.repository.inserir(categoria);
  }

  async listar(): Promise<Categoria[]> {
    return this.repository.listar();
  }

  async buscarPorId(id: number): Promise<Categoria> {
    this.validarId(id);

    const categoria = await this.repository.buscarPorId(id);

    if (!categoria) {
      throw new Error("404|Categoria não encontrada");
    }

    return categoria;
  }

  async atualizar(id: number, dados: Partial<Categoria>): Promise<Categoria> {
    this.validarId(id);

    if (dados.nome !== undefined) {
      if (!dados.nome.trim()) {
        throw new Error("400|Nome inválido");
      }
      dados.nome = dados.nome.trim();
    }

    if (dados.descricao !== undefined && dados.descricao !== null) {
      dados.descricao = dados.descricao.trim();
    }

    const categoria = await this.repository.atualizar(id, dados);

    if (!categoria) {
      throw new Error("404|Categoria não encontrada");
    }

    return categoria;
  }

  async deletar(id: number): Promise<void> {
    this.validarId(id);

    const removido = await this.repository.deletar(id);

    if (!removido) {
      throw new Error("404|Categoria não encontrada");
    }
  }
}