import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = "segredo";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ erro: "Token não informado" });

  try {
    const decoded = jwt.verify(token, SECRET);
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(403).json({ erro: "Token inválido" });
  }
}