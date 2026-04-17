import express from "express";
import { AppDataSource } from "./data-source";

import { CategoriaRepository } from "./repository/categoria-repository";
import { TenisRepository } from "./repository/tenis-repository";

import { CategoriaService } from "./service/categoria-service";
import { TenisService } from "./service/tenis-service";

import { CategoriaController } from "./controller/categoria-controller";
import { TenisController } from "./controller/tenis-controller";

import { categoriaRotas } from "./router/categoria-router";
import { tenisRotas } from "./router/tenis-router";
import { authMiddleware } from "./middleware/auth-middleware";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/hello", (_req, res) => {
  res.status(200).json({ message: "BuySneakers API funcionando" });
});

AppDataSource.initialize()
  .then(() => {
    console.log("Banco conectado com sucesso.");

    const categoriaRepository = new CategoriaRepository();
    const tenisRepository = new TenisRepository();

    const categoriaService = new CategoriaService(categoriaRepository);
    const tenisService = new TenisService(tenisRepository, categoriaRepository);

    const categoriaController = new CategoriaController(categoriaService);
    const tenisController = new TenisController(tenisService);

    app.use("/api/categorias", categoriaRotas(categoriaController));
    app.use("/api/tenis", authMiddleware, tenisRotas(tenisController));

    app.listen(port, () => {
      console.log(`Servidor BuySneakers rodando em http://localhost:${port}`);
    });
  })
  .catch((erro) => {
    console.error("Erro ao conectar no banco:", erro);
  });