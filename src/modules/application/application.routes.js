import express from "express";
import { checkRole } from "../../middleware/role.js";
import { applyToJob } from "./controller/application.controller.js";
import { validation } from './../../middleware/validation.js';
import { applayApplicationSchema } from "./application.validation.js";
import { uploadSingle } from "../../utils/fileUpload.js";

const routes = express.Router();


routes.route("/:id")
.post(uploadSingle('userResume'),validation(applayApplicationSchema),checkRole("User"),applyToJob);


export default routes;
