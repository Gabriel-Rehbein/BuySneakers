import { Categoria } from "../model/categoria";
import { CategoriaRepository } from "../repository/categoria-repository";

export class CategoriaService {
  constructor(private repository: CategoriaRepository) {}

  private validarId(id: number): void {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("400|ID da categoria inválido");
    }
  }

  private validarNome(nome: unknown): string {
    if (typeof nome !== "string" || !nome.trim()) {
      throw new Error("400|Nome da categoria é obrigatório");
    }

    return nome.trim();
  }

  private tratarDescricao(descricao?: string | null): string | undefined {
    if (descricao === undefined || descricao === null) {
      return undefined;
    }

    const valor = descricao.trim();
    return valor ? valor : undefined;
  }

  async inserir(categoria: Categoria): Promise<Categoria> {
    categoria.nome = this.validarNome(categoria?.nome);
    categoria.descricao = this.tratarDescricao(categoria?.descricao);

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
      dados.nome = this.validarNome(dados.nome);
    }

    if (dados.descricao !== undefined) {
      dados.descricao = this.tratarDescricao(dados.descricao);
    }

    const categoriaAtualizada = await this.repository.atualizar(id, dados);

    if (!categoriaAtualizada) {
      throw new Error("404|Categoria não encontrada");
    }

    return categoriaAtualizada;
  }

  async deletar(id: number): Promise<void> {
    this.validarId(id);

    const removido = await this.repository.deletar(id);

    if (!removido) {
      throw new Error("404|Categoria não encontrada");
    }
  }
}