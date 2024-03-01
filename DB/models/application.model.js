import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Types.ObjectId,
      ref: "Job",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    addedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    userTechSkills: [String],
    userSoftSkills: [String],
    userResume: {
      type: String,
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

// schema.post('init',function (doc){
// console.log(doc);

// doc.userResume ? doc.userResume = process.env.BASEURL+'uploads/'+ doc.userResume : '';

// })

const applicationModel = mongoose.model("Application", schema);

export default applicationModel;
