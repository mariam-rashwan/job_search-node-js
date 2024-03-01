import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/jobSearchApp")
    .then(() => {
      console.log("DB connected");
    })
    .catch((err) => {
      console.log("DB error", err);
    });
};
