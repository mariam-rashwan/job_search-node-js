import mongoose, { Schema, model, Types } from "mongoose";

const schema = new Schema(
  {
    companyName: {
      type: String,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    industry: {
      type: String,
    },
    address: {
      type: String,
      trim: true,
    },
    numberOfEmployees: {
      type: Number,
      min: 11,
      max: 20,
    },
    companyEmail: {
      type: String,
      unique: true,
    },
    companyHR: {
      type: Types.ObjectId,
      ref: "User",
    },
    jobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const companyModel = model("Company", schema);

export default companyModel;
