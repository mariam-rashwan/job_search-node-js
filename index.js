import dotenv from "dotenv";
dotenv.config({});
import express from "express";
import { dbConnection } from "./DB/connection.js";
import { allRoutes } from "./src/modules/routes.js";
import { globalError } from "./src/utils/globalErrorHandle.js";

import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY_CLOUDINARY,
  api_secret: process.env.CLOUDINARY_SK_KEY,
});

const app = express();
const port = 3000;
app.use(express.json());
app.use("/uploads", express.static("uploads"));

dbConnection();
allRoutes(app);

app.use("*", (req, res, next) => {
  next(new AppError("Url not found", 404));
});

app.use(globalError);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
