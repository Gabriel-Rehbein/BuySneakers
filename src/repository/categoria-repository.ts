import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Categoria } from "../model/categoria";

export class CategoriaRepository {
  private repository: Repository<Categoria>;

  constructor() {
    this.repository = AppDataSource.getRepository(Categoria);
  }

  async inserir(categoria: Categoria): Promise<Categoria> {
    return this.repository.save(categoria);
  }

  async listar(): Promise<Categoria[]> {
    return this.repository.find({
      relations: ["tenis"],
      order: { id: "ASC" },
    });
  }

  async buscarPorId(id: number): Promise<Categoria | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["tenis"],
    });
  }

  async atualizar(id: number, dados: Partial<Categoria>): Promise<Categoria | null> {
    const categoriaExistente = await this.buscarPorId(id);
    if (!categoriaExistente) {
      return null;
    }

    Object.assign(categoriaExistente, dados);
    return this.repository.save(categoriaExistente);
  }

  async deletar(id: number): Promise<boolean> {
    const categoriaExistente = await this.buscarPorId(id);
    if (!categoriaExistente) {
      return false;
    }

    await this.repository.remove(categoriaExistente);
    return true;
  }
}