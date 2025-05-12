import { Router } from "express";
import { authMiddleware, isStudent } from "../middlewere/login.middlewere.js";
import {
  createProblem,
  getAllProblems,
  getProblemById,
} from "../controllers/student.controller.js";

Router.post("createProblem", authMiddleware, isStudent, createProblem);
Router.post("createProblem", authMiddleware, isStudent, getAllProblems);
Router.get("/getProblemById/:id", authMiddleware, isStudent, getProblemById);
