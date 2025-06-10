import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
        required: false,
      },
    ], // e.g., ['hostel', 'exam', 'canteen']
    status: {
      type: String,
      enum: ["PENDING", "INPROGRESS", "RESOLVED"],
      default: "PENDING",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    response: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;
