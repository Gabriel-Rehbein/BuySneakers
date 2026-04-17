import { Router } from "express";
import { TenisController } from "../controller/tenis-controller";
import { authMiddleware } from "../middleware/auth-middleware";
import { upload } from "../middleware/upload-middleware";

export const tenisRotas = (controller: TenisController): Router => {
  const router = Router();

  // 📌 Público
  router.get("/", controller.listar.bind(controller));
  router.get("/:id", controller.buscarPorId.bind(controller));

  // 🔐 Protegido + Upload de imagem
  router.post(
    "/",
    authMiddleware,
    upload.single("imagem"),
    controller.inserir.bind(controller)
  );

  router.put(
    "/:id",
    authMiddleware,
    upload.single("imagem"),
    controller.atualizar.bind(controller)
  );

  router.delete(
    "/:id",
    authMiddleware,
    controller.deletar.bind(controller)
  );

  return router;
};