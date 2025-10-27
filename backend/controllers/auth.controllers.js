import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.models.js";

export const create = async (req, res) => {
  const { sid, password, name, role } = req.body;

  try {
    const hpass = await bcrypt.hash(password, 10);
    const user = await User.create({
      sid,
      password: hpass,
      name,
      role,
    });

    res.status(200).json({
      succees: true,
      message: "User created",
    });
  } catch (error) {}
};

export const login = async (req, res) => {
  const { sid, password } = req.body;
  if (!sid || !password) {
    return res.status(401).json({
      success: false,
      message: "Both feilds are required",
    });
  }

  try {
    const user = await User.findOne({
      sid,
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User does not exists",
      });
    }

    const passMatch = await bcrypt.compare(password, user.password);

    if (!passMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Username Or Password",
      });
    }

    const token = jwt.sign(
      {
        sid: user.sid,
        role: user.role,
      },
      process.env.SECRATE_KEY,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: true,
      httpOnly: true,
    });

    res.status(200).json({
      succees: true,
      message: "User logged in sucessfully",
      token,
      user: {
        sid: user.sid,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({
      error: "Error logging in user",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({
      error: "Error logging out user",
    });
  }
};

export const changePassword = async (req, res) => {
  const { sid, oldPassword, password } = req.body;

  if (!sid || !oldPassword || !password) {
    return res.status(401).json({
      success: false,
      message: "All feilds are required",
    });
  }

  try {
    const user = await User.findOne({
      sid,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User does not exists",
      });
    }
    const isMatched = await bcrypt.compare(oldPassword, user.password);
    if (isMatched) {
      const hashPassword = await bcrypt.hash(password, 10);

      user.password = hashPassword;
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Password has been Changed",
      });
    }

    return res.status(200).json({
      success: false,
      message: "The Old Password Does Not Match",
    });
  } catch (error) {
    console.error("Error Changing Password:", error);
    res.status(500).json({
      error: "Error Changing Password",
    });
  }
};

export const check = async (req, res) => {
  try {
    res.status(201).json({
      success: true,
      message: "User Checked Sucessfully",
      user: req.user,
    });
  } catch (error) {
    console.error("Error checking user:", error);
    res.status(500).json({
      error: "Error checking user",
    });
  }
};
