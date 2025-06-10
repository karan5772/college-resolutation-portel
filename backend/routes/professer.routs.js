import express from "express";
import { authMiddleware, isProfessor } from "../middlewere/login.middlewere.js";
import {
  getAllProblems,
  getProblemById,
  respondToProblemById,
} from "../controllers/professer.controller.js";

const professorRouter = express.Router();

professorRouter.get("/", authMiddleware, isProfessor, getAllProblems);
professorRouter.get(
  "/getProblemById/:id",
  authMiddleware,
  isProfessor,
  getProblemById
);
professorRouter.post(
  "/respondToProblemById/:id",
  authMiddleware,
  isProfessor,
  respondToProblemById
);

export default professorRouter;
