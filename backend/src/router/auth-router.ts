import { Router } from "express";
import { AuthController } from "../controller/auth-controller";

export const authRotas = (controller: AuthController): Router => {
  const router = Router();

  router.post("/registrar", controller.registrar.bind(controller));
  router.post("/login", controller.login.bind(controller));

  return router;
};