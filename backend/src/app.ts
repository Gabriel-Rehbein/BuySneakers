import "reflect-metadata";
import dotenv from "dotenv";

dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import path from "path";
import { AppDataSource, criarBancoSeNaoExistir } from "./data-source";

import { CategoriaRepository } from "./repository/categoria-repository";
import { TenisRepository } from "./repository/tenis-repository";
import { UsuarioRepository } from "./repository/usuario-repository";
import { PedidoRepository } from "./repository/pedido-repository";

import { CategoriaService } from "./service/categoria-service";
import { TenisService } from "./service/tenis-service";
import { AuthService } from "./service/auth-service";
import { PedidoService } from "./service/pedido-service";

import { CategoriaController } from "./controller/categoria-controller";
import { TenisController } from "./controller/tenis-controller";
import { AuthController } from "./controller/auth-controller";
import { PedidoController } from "./controller/pedido-controller";

import { categoriaRotas } from "./router/categoria-router";
import { tenisRotas } from "./router/tenis-router";
import { authRotas } from "./router/auth-router";
import { pedidoRotas } from "./router/pedido-router";

const app = express();
const port = 3000;
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

function tratarErroGlobal(
  erro: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  if (res.headersSent) {
    next(erro);
    return;
  }

  if (erro instanceof SyntaxError) {
    res.status(400).json({ erro: "JSON inválido" });
    return;
  }

  if (erro instanceof Error) {
    const [status, mensagem] = erro.message?.split("|") || [];
    res.status(Number(status) || 500).json({
      erro: mensagem || "Erro interno no servidor",
    });
    return;
  }

  res.status(500).json({ erro: "Erro interno no servidor" });
}

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
  }

  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

app.use(express.json());

// servir arquivos de mídia
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

app.get("/hello", (_req, res) => {
  res.status(200).json({
    message: "BuySneakers API funcionando",
    conceitos: ["C", "B", "A"],
  });
});

criarBancoSeNaoExistir()
  .then(() => AppDataSource.initialize())
  .then(() => {
    console.log("Banco conectado.");

    // repositories
    const categoriaRepository = new CategoriaRepository();
    const tenisRepository = new TenisRepository();
    const usuarioRepository = new UsuarioRepository();
    const pedidoRepository = new PedidoRepository();

    // services
    const categoriaService = new CategoriaService(categoriaRepository);
    const tenisService = new TenisService(
      tenisRepository,
      categoriaRepository
    );
    const authService = new AuthService(usuarioRepository);
    const pedidoService = new PedidoService(
      pedidoRepository,
      usuarioRepository,
      tenisRepository
    );

    // controllers
    const categoriaController = new CategoriaController(categoriaService);
    const tenisController = new TenisController(tenisService);
    const authController = new AuthController(authService);
    const pedidoController = new PedidoController(pedidoService);

    // routes
    app.use("/api/auth", authRotas(authController));
    app.use("/api/categorias", categoriaRotas(categoriaController));
    app.use("/api/tenis", tenisRotas(tenisController));
    app.use("/api/pedidos", pedidoRotas(pedidoController));
    app.use(tratarErroGlobal);

    app.listen(port, () => {
      console.log(`API rodando em http://localhost:${port}`);
    });
  })
  .catch((erro) => {
    console.error("Erro ao conectar no banco.");
    process.exit(1);
  });
