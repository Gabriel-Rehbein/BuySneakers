import { Router } from "express";
import { TenisController } from "../controller/tenis-controller";

export const tenisRotas = (controller: TenisController): Router => {
  const router = Router();

  router.post("/", controller.inserir.bind(controller));
  router.get("/", controller.listar.bind(controller));
  router.get("/:id", controller.buscarPorId.bind(controller));
  router.put("/:id", controller.atualizar.bind(controller));
  router.delete("/:id", controller.deletar.bind(controller));

  return router;
};