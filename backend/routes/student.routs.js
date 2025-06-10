import express from "express";
import { authMiddleware, isStudent } from "../middlewere/login.middlewere.js";
import {
  createProblem,
  getAllProblems,
  getProblemById,
} from "../controllers/student.controller.js";

const studentRouter = express.Router();

studentRouter.post("/createProblem", authMiddleware, isStudent, createProblem);
studentRouter.get("/allProblem", authMiddleware, isStudent, getAllProblems);
studentRouter.get(
  "/getProblemById/:id",
  authMiddleware,
  isStudent,
  getProblemById
);

export default studentRouter;
