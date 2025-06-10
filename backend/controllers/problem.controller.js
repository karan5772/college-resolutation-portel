import Problem from "../models/problem.modles.js";
import User from "../models/user.models.js";

export const createProblem = async (req, res) => {
  const { title, description, tags } = req.body;
  if (!title || !description) {
    return res.status(404).json({
      success: false,
      message: "Both the title and description feilds are required",
    });
  }
  const userId = req.user.id;
  const sid = req.user.sid;

  try {
    const user = await User.findOne({
      sid,
      _id: userId,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    if (user.role !== "STUDENT") {
      return res
        .status(403)
        .json({ message: "Only Students Can Post Problems." });
    }

    const newProblem = await Problem.create({
      title,
      description,
      tags: tags || [],
      createdBy: userId,
    });

    user.problems.push(newProblem._id);
    await user.save();

    res.status(201).json({
      message: "Problem posted successfully.",
      problem: newProblem,
    });
  } catch (error) {
    console.error("Error creating problem:", error);
    res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find();
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

// export const editProblem= async (req,res) => {
//     const { title, description, tags } = req.body;
//     if (!!title || !!description){
//         return res.status(400).json({
//             success : false,
//             messege : "Both the title and description feilds are required",
//         })
//     }

//     try {
//         const problem = await Problem.findOne({

//         });
//         if(!user){
//             return res.status(400).json({
//                 success : false,
//                 messege : "User does not exist",
//             })
//         }

//         user.name=name,
//         user.phone=phone,

//         await user.save();

//         return res.status(200).json({
//             success : true,
//             messege : "User has been updated",
//         })

//     }
//     catch (error) {
//         console.error("Error updating user:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error",
//         });
//     }
// }

export const getProblemById = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Id Not Found",
    });
  }

  try {
    const problem = await Problem.findById(id);

    if (!problem) {
      return res.status(400).json({
        success: false,
        message: "Problem Not Found",
      });
    }

    res.status(200).json({
      success: true,
      problem,
    });
  } catch (error) {
    console.error("Error getting problem:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
