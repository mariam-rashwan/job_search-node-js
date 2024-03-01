import express from "express";
import { validation } from "../../middleware/validation.js";
import {
  addCompanySchema,
  companyNameSchema,
  IdSchema,
  updateCompanySchema,
} from "./company.validation.js";
import {
  addCompany,
  deleteCompany,
  getByIdCompanyData,
  getCompanyWithName,
  getJobApplications,
  updateCompanyData,
} from "./controller/company.controller.js";
import { checkRole } from "../../middleware/role.js";

const routes = express.Router();

//Add Company
routes
  .route("/")
  .post(checkRole("Company_HR"), validation(addCompanySchema), addCompany);

//update Company
//delete
//get company data with id & populate jobs
routes
  .route("/:id")
  .patch(
    checkRole("Company_HR"),
    validation(updateCompanySchema),
    updateCompanyData
  )
  .delete(checkRole("Company_HR"), validation(IdSchema), deleteCompany)
  .get(checkRole("Company_HR"), validation(IdSchema), getByIdCompanyData);

//get company data with name
routes.get(
  "/name/:companyName",
  checkRole("both"),
  validation(companyNameSchema),
  getCompanyWithName
);

routes.get(
  "/application/:id",
  checkRole("Company_HR"),
  validation(IdSchema),
  getJobApplications
);

export default routes;
