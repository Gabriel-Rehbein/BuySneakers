import { Request, Response } from "express";
import { AuthService } from "../service/auth-service";

export class AuthController {
  constructor(private service: AuthService) {}

  private tratarErro(res: Response, erro: unknown): void {
    if (erro instanceof Error) {
      const [status, mensagem] = erro.message?.split("|") || [];
      res.status(Number(status) || 500).json({
        erro: mensagem || "Erro interno no servidor",
      });
      return;
    }

    res.status(500).json({ erro: "Erro interno no servidor" });
  }

  registrar = async (req: Request, res: Response): Promise<void> => {
    try {
      const usuario = await this.service.registrar(req.body);

      res.status(201).json({
        mensagem: "Usuário cadastrado com sucesso",
        dados: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
        },
      });
    } catch (erro) {
      this.tratarErro(res, erro);
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const resultado = await this.service.login(req.body);

      res.status(200).json({
        mensagem: "Login realizado com sucesso",
        ...resultado,
      });
    } catch (erro) {
      this.tratarErro(res, erro);
    }
  };
}