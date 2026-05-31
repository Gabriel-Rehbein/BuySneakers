import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const SECRET = "segredo";

export class AuthService {
  gerarToken(usuario: any) {
    return jwt.sign({ id: usuario.id }, SECRET, { expiresIn: "1h" });
  }

  async hashSenha(senha: string) {
    return await bcrypt.hash(senha, 10);
  }

  async compararSenha(senha: string, hash: string) {
    return await bcrypt.compare(senha, hash);
  }
}