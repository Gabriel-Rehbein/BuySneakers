import { Router } from "express";
import { CategoriaController } from "../controller/categoria-controller";
import { authMiddleware } from "../middleware/auth-middleware";

export const categoriaRotas = (controller: CategoriaController): Router => {
  const router = Router();

  // 📌 Público
  router.get("/", controller.listar.bind(controller));
  router.get("/:id", controller.buscarPorId.bind(controller));

  // 🔐 Protegido
  router.post("/", authMiddleware, controller.inserir.bind(controller));
  router.put("/:id", authMiddleware, controller.atualizar.bind(controller));
  router.delete("/:id", authMiddleware, controller.deletar.bind(controller));

  return router;
};