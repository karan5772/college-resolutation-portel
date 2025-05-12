import express from "express";
import {
  changePassword,
  create,
  login,
  logout,
} from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewere/login.middlewere.js";

const authRouter = express.Router();

authRouter.post("/create", create);
authRouter.post("/login", login);
authRouter.post("/logout", authMiddleware, logout);
authRouter.post("/changePassword", authMiddleware, changePassword);

export default authRouter;
