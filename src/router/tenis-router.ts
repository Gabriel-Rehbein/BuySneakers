import { Router } from "express";
import { TenisController } from "../controller/tenis-controller";

export const tenisRotas = (controller: TenisController): Router => {
  const router = Router();

  router.post("/", controller.inserir);
  router.get("/", controller.listar);
  router.get("/:id", controller.buscarPorId);
  router.put("/:id", controller.atualizar);
  router.delete("/:id", controller.deletar);

  return router;
};