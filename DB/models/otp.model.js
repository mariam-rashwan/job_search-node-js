import mongoose from "mongoose";

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5,
    // The document will be automatically deleted after 5 minutes of its creation time
  },
});

const otpModel = mongoose.model("Otp", schema);

export default otpModel;
