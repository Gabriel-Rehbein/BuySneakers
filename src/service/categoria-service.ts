import { Categoria } from "../model/categoria";
import { CategoriaRepository } from "../repository/categoria-repository";

export class CategoriaService {
  constructor(private repository: CategoriaRepository) {}

  async inserir(categoria: Categoria): Promise<Categoria> {
    if (!categoria?.nome?.trim()) {
      throw { id: 400, msg: "Nome da categoria é obrigatório" };
    }

    return await this.repository.inserir(categoria);
  }

  async listar(): Promise<Categoria[]> {
    return await this.repository.listar();
  }

  async buscarPorId(id: number): Promise<Categoria> {
    const categoria = await this.repository.buscarPorId(id);

    if (!categoria) {
      throw { id: 404, msg: "Categoria não encontrada" };
    }

    return categoria;
  }

  async atualizar(id: number, dados: Partial<Categoria>): Promise<Categoria> {
    if (dados.nome !== undefined && !dados.nome.trim()) {
      throw { id: 400, msg: "Nome da categoria inválido" };
    }

    const categoria = await this.repository.atualizar(id, dados);

    if (!categoria) {
      throw { id: 404, msg: "Categoria não encontrada" };
    }

    return categoria;
  }

  async deletar(id: number): Promise<void> {
    const removido = await this.repository.deletar(id);

    if (!removido) {
      throw { id: 404, msg: "Categoria não encontrada" };
    }
  }
}