import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    username: String,

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    recoveryEmail: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    DOB: {
      type: Date,
    },
    mobileNumber: {
      type: String,
      unique: true,
      required: true,
    },

    role: {
      type: String,
      enum: ["User", "Company_HR"],
      default: "User",
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    company: {
      type: mongoose.Types.ObjectId,
      ref: "Company",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isVerfied: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", schema);

export default userModel;
