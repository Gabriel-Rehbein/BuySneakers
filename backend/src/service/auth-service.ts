import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UsuarioRepository } from "../repository/usuario-repository";
import { Usuario } from "../model/usuario";

type UsuarioInput = {
  nome: string;
  email: string;
  senha: string;
};

type LoginInput = {
  email: string;
  senha: string;
};

const JWT_SECRET = process.env.JWT_SECRET || "segredo_super_secreto";

export class AuthService {
  constructor(private usuarioRepository: UsuarioRepository) {}

  private validarEmail(email: string): string {
    if (!email?.trim()) {
      throw new Error("400|E-mail é obrigatório");
    }

    const emailTratado = email.trim().toLowerCase();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(emailTratado)) {
      throw new Error("400|E-mail inválido");
    }

    return emailTratado;
  }

  private validarSenha(senha: string): void {
    if (!senha?.trim()) {
      throw new Error("400|Senha é obrigatória");
    }

    if (senha.length < 6) {
      throw new Error("400|A senha deve ter no mínimo 6 caracteres");
    }
  }

  async registrar(dados: UsuarioInput): Promise<Usuario> {
    if (!dados?.nome?.trim()) {
      throw new Error("400|Nome é obrigatório");
    }

    const email = this.validarEmail(dados.email);
    this.validarSenha(dados.senha);

    const usuarioExistente = await this.usuarioRepository.buscarPorEmail(email);
    if (usuarioExistente) {
      throw new Error("409|Já existe um usuário com este e-mail");
    }

    const senhaHash = await bcrypt.hash(dados.senha, 10);

    const usuario = new Usuario();
    usuario.nome = dados.nome.trim();
    usuario.email = email;
    usuario.senha = senhaHash;

    return this.usuarioRepository.inserir(usuario);
  }

  async login(dados: LoginInput): Promise<{ token: string }> {
    const email = this.validarEmail(dados.email);
    this.validarSenha(dados.senha);

    const usuario = await this.usuarioRepository.buscarPorEmailComSenha(email);
    if (!usuario) {
      throw new Error("401|E-mail ou senha inválidos");
    }

    const senhaCorreta = await bcrypt.compare(dados.senha, usuario.senha);
    if (!senhaCorreta) {
      throw new Error("401|E-mail ou senha inválidos");
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    return { token };
  }
}