import express from "express";
import { validation } from "../../middleware/validation.js";
import { checkRole } from "../../middleware/role.js";
import {
  addJob,
  deleteJob,
  filterJobs,
  getAllCompanyNameJobs,
  getAllJobs,
  updateJob,
} from "./controller/job.controller.js";
import {
  addJobSchema,
  filterJobSchema,
  updateJobSchema,
  validatCompanyNameSchema,
  validateIdSchema,
} from "./job.validation.js";

const routes = express.Router();

//Add job
//get job

routes
  .route("/")
  .post(checkRole("Company_HR"), validation(addJobSchema), addJob)
  .get(checkRole("both"), getAllJobs);

routes.get(
  "/name",
  checkRole("both"),
  validation(validatCompanyNameSchema),
  getAllCompanyNameJobs
);

routes.patch("/filter",checkRole("both"),validation(filterJobSchema),filterJobs);

routes
  .route("/:id")
  .patch(checkRole("Company_HR"), validation(updateJobSchema), updateJob)
  .delete(checkRole("Company_HR"), validation(validateIdSchema), deleteJob);

export default routes;
