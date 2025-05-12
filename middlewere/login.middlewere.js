import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import dotenv from "dotenv";
dotenv.config();
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - token not provided",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRATE_KEY);
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid Token",
      });
    }

    const user = await User.findOne({
      sid: decoded.sid,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(`Error authentacing user : ${error}`);
    return res.status(401).json({
      success: false,
      message: "Error authentacing user",
    });
  }
};

export const isStudent = (req, res, next) => {
  try {
    if (req.user.role !== "STUDENT") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Students only.",
      });
    }
    next();
  } catch (error) {
    console.error("Student Role Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const isProfessor = (req, res, next) => {
  try {
    if (req.user.role !== "PROFESSOR") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Professors only.",
      });
    }
    next();
  } catch (error) {
    console.error("Professor Role Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admins only.",
      });
    }
    next();
  } catch (error) {
    console.error("Admin Role Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
