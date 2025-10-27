import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import db from "./utils/db.utils.js";
import authRoute from "./routes/auth.routs.js";
import studentRouter from "./routes/student.routs.js";
import professorRouter from "./routes/professer.routs.js";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

dotenv.config();

app.use(express.json());
app.use(cookieParser());

db();
const PORT = process.env.PORT || 4001;

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/professor", professorRouter);

app.listen(PORT, () => {
  console.log("Server started on port :", PORT);
});
