import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Tenis } from "../model/tenis";

export class TenisRepository {
  private repository: Repository<Tenis>;

  constructor() {
    this.repository = AppDataSource.getRepository(Tenis);
  }

  async inserir(tenis: Tenis): Promise<Tenis> {
    return this.repository.save(tenis);
  }

  async listar(): Promise<Tenis[]> {
    return this.repository.find({
      relations: ["categoria"],
      order: { id: "ASC" },
    });
  }

  async buscarPorId(id: number): Promise<Tenis | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["categoria"],
    });
  }

  async atualizar(id: number, dados: Partial<Tenis>): Promise<Tenis | null> {
    const tenisExistente = await this.buscarPorId(id);
    if (!tenisExistente) {
      return null;
    }

    Object.assign(tenisExistente, dados);
    return this.repository.save(tenisExistente);
  }

  async deletar(id: number): Promise<boolean> {
    const tenisExistente = await this.buscarPorId(id);
    if (!tenisExistente) {
      return false;
    }

    await this.repository.remove(tenisExistente);
    return true;
  }
}