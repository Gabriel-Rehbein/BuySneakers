import { Router } from "express";
import { PedidoController } from "../controller/pedido-controller";
import { authMiddleware } from "../middleware/auth-middleware";

export const pedidoRotas = (controller: PedidoController): Router => {
  const router = Router();

  router.get("/", authMiddleware, controller.listar.bind(controller));
  router.get("/meus", authMiddleware, controller.meusPedidos.bind(controller));
  router.get("/:id", authMiddleware, controller.buscarPorId.bind(controller));
  router.post("/", authMiddleware, controller.criar.bind(controller));

  return router;
};