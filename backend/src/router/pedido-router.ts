import { Router } from "express";
import { PedidoController } from "../controller/pedido-controller";
import { authMiddleware } from "../middleware/auth-middleware";

export const pedidoRotas = (controller: PedidoController): Router => {
  const router = Router();

  router.get("/", authMiddleware, controller.listar.bind(controller));
  router.get("/meus", authMiddleware, controller.meusPedidos.bind(controller));
  router.get("/:id", authMiddleware, controller.buscarPorId.bind(controller));
  router.post("/", authMiddleware, controller.criar.bind(controller));
  router.put("/:id", authMiddleware, controller.atualizar.bind(controller));
  router.patch("/:id", authMiddleware, controller.partialUpdate.bind(controller));
  router.delete("/:id", authMiddleware, controller.deletar.bind(controller));

  return router;
};