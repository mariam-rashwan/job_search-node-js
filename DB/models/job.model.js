import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },
    jobLocation: {
      type: String,
      enums: ["onsite", "remotely", "hybrid"],
      default: "remotely",
    },
    workingTime: {
      type: String,
      enums: ["part-time", "full-time"],
      default: "full-time",
    },

    seniorityLevel: {
      type: String,
      enums: ["Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"],
      default: "Mid-Level",
    },
    jobDescription: {
      type: String,
    },
    technicalSkills: [String],
    softSkills: [String],
    addedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    company: {
      type: mongoose.Types.ObjectId,
      ref: "Company",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const jobModel = mongoose.model("Job", schema);

export default jobModel;
