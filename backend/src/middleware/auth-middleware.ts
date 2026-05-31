import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "segredo_super_secreto";

type TokenPayload = {
  id: number;
  email: string;
};

declare global {
  namespace Express {
    interface Request {
      usuario?: TokenPayload;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ erro: "Token não informado" });
      return;
    }

    const [tipo, token] = authHeader.split(" ");

    if (tipo !== "Bearer" || !token) {
      res.status(401).json({ erro: "Token inválido" });
      return;
    }

    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
    req.usuario = payload;

    next();
  } catch {
    res.status(401).json({ erro: "Não autorizado" });
  }
}