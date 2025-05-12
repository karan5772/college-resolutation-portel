import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import db from "./utils/db.utils.js";
import authRouter from "./routes/auth.routs.js";
import issueRouter from "./routes/problem.routs.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("layout", "./layouts/main");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

db();
const PORT = process.env.PORT || 4001;

app.use("/api/v2/users", authRouter);
app.use("/api/v2/issue", issueRouter);

app.listen(PORT, () => {
  console.log("Server started on port :", PORT);
});
