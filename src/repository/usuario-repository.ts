import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Usuario } from "../model/usuario";

export class UsuarioRepository {
  private repository: Repository<Usuario>;

  constructor() {
    this.repository = AppDataSource.getRepository(Usuario);
  }

  async inserir(usuario: Usuario): Promise<Usuario> {
    return this.repository.save(usuario);
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return this.repository.findOne({
      where: { email },
    });
  }

  async buscarPorEmailComSenha(email: string): Promise<Usuario | null> {
    return this.repository
      .createQueryBuilder("usuario")
      .addSelect("usuario.senha")
      .where("usuario.email = :email", { email })
      .getOne();
  }

  async buscarPorId(id: number): Promise<Usuario | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["pedidos"],
    });
  }

  async listar(): Promise<Usuario[]> {
    return this.repository.find({
      relations: ["pedidos"],
      order: { id: "ASC" },
    });
  }
}