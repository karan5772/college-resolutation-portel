import express from "express";
import {
  changePassword,
  check,
  create,
  login,
  logout,
} from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewere/login.middlewere.js";

const authRouter = express.Router();

authRouter.post("/create", create);
authRouter.get("/check", authMiddleware, check);
authRouter.post("/login", login);
authRouter.post("/logout", authMiddleware, logout);
authRouter.post("/changePassword", authMiddleware, changePassword);

export default authRouter;
