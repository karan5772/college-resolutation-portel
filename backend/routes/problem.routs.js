import express from "express";
import {
  createProblem,
  getAllProblems,
  getProblemById,
} from "../controllers/problem.controller.js";
import {
  authMiddleware,
  isProfessor,
  isStudent,
} from "../middlewere/login.middlewere.js";

const issueRouter = express.Router();

issueRouter.post("/createProblem", authMiddleware, isStudent, createProblem);
//issueRouter.post("/editProblem", authMiddleware, isStudent, editProblem);
issueRouter.get("/getAllProblems", authMiddleware, isProfessor, getAllProblems);
issueRouter.get(
  "/getProblemById/:id",
  authMiddleware,
  isProfessor,
  getProblemById
);

export default issueRouter;
