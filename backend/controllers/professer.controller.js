import Problem from "../models/problem.modles.js";

export const getAllProblems = async (req, res) => {
  const sid = req.user.sid;
  if (!sid) {
    return res.status(404).json({
      success: false,
      message: "Login First to view the problems",
    });
  }

  try {
    const problems = await Problem.find().populate({
      path: "createdBy",
      select: "name sid", // add sid if you want student id too
    });
    res.status(200).json({
      success: true,
      problems,
    });
  } catch (error) {
    console.error("Error getting problems:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getProblemById = async (req, res) => {
  console.log(req.params);
  const problemId = req.params.id;
  if (!problemId) {
    return res.status(400).json({
      success: false,
      message: "Problem ID is required",
    });
  }

  try {
    const problem = await Problem.findById(problemId).populate({
      path: "createdBy",
      select: "name sid", // add sid if you want student id too
    });
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }
    res.status(200).json({
      success: true,
      problem,
    });
  } catch (error) {
    console.error("Error getting problem by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const respondToProblemById = async (req, res) => {
  const problemId = req.params.id;
  const { response, status } = req.body;

  if (!problemId || !response) {
    return res.status(400).json({
      success: false,
      message: "Problem ID and response are required",
    });
  }

  try {
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    problem.response = response;
    problem.status = status || "INPROGRESS";
    await problem.save();

    res.status(200).json({
      success: true,
      message: "Response added successfully",
      problem,
    });
  } catch (error) {
    console.error("Error responding to problem by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
