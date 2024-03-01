import { handleError } from "../../../middleware/handleError.js";
import { AppError } from "../../../utils/AppError.js";
import companyModel from "../../../../DB/models/company.model.js";
import jobModel from "../../../../DB/models/job.model.js";
import userModel from "../../../../DB/models/user.model.js";
import applicationModel from "./../../../../DB/models/application.model.js";

// create company
// 1-check if user excist
// 2-check unique data if excist in db
// 3-add companyHr=>id
// 4-update the userModel with companyid that
//  create this company
//Note one HrOrCompanyOwner can create one company
const addCompany = handleError(async (req, res, next) => {
  let excistUser = await userModel.findById(req.userId);
  if (!excistUser) {
    return next(new AppError("user not found", 401));
  }
  let {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  } = req.body;
  req.body.companyHR = req.userId;
  const excistCompanyHr = await companyModel.findOne({ companyHR: req.userId });
  const excistCompanyName = await companyModel.findOne({ companyName });
  const excistCompanyEmail = await companyModel.findOne({ companyEmail });
  if (excistCompanyHr) {
    return next(new AppError("company Hr can create one company", 409));
  }
  if (excistCompanyName) {
    return next(new AppError("company name already exist", 409));
  }
  if (excistCompanyEmail) {
    return next(new AppError("company email already exist", 409));
  }

  let newCompany = new companyModel(req.body);
  const added = await newCompany.save();

  await userModel.findByIdAndUpdate(
    req.userId,
    { company: added._id },
    { new: true }
  );

  return res.status(201).json({ message: "Succes", added });
});

// update company data
// 1-check if user excist
// check if companyId and hrId from token excist in same company
//  so the owner only can update
//check with id from token if commpany excist
//check if email already excist =>to make sure it's unique
//  => then if excist in the same user => ok let it
//          else in another user error message it's already excist
// check if company name already exists and same logic as mail
// at last will update data

const updateCompanyData = handleError(async (req, res, next) => {
  let {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  } = req.body;

  if (!req.params.id) {
    return next(new AppError("Add company id", 400));
  }
  let excistUser = await userModel.findById(req.userId);
  if (!excistUser) {
    return next(new AppError("user not found", 401));
  }

  let company = await companyModel.findById(req.params.id);
  if (!company) {
    return next(new AppError("company not found", 401));
  }

  let excistCompany = await companyModel.findOne({
    _id: req.params.id,
    companyHR: req.userId,
  });
  if (!excistCompany) {
    return next(new AppError("company owner only can update", 403));
  }
  if (companyEmail) {
    const excistCompanyMAil = await companyModel.findOne({ companyEmail });
    if (excistCompanyMAil && excistCompanyMAil.companyHR != req.userId) {
      return next(new AppError("company email already excist", 409));
    }
  }
  if (companyName) {
    const excistCompanyName = await companyModel.findOne({ companyName });
    if (excistCompanyName && excistCompanyName.companyHR != req.userId)
      return next(new AppError("company name already exist", 409));
  }
  const updated = await companyModel.findByIdAndUpdate(
    req.params.id,
    {
      companyName,
      description,
      industry,
      address,
      numberOfEmployees,
      companyEmail,
    },
    {
      new: true,
    }
  );

  updated && res.status(200).json({ message: "Succes", updated });
  !updated && next(new AppError("company not exist", 401));
});

//check user excist
//check company excist
//check user & company in same
//delet

const deleteCompany = handleError(async (req, res, next) => {
  let excistUser = await userModel.findById(req.userId);
  if (!excistUser) {
    return next(new AppError("user not found", 401));
  }
  let company = await companyModel.findById(req.params.id);
  if (!company) {
    return next(new AppError("company not found", 401));
  }
  let excistCompany = await companyModel.findOne({
    _id: req.params.id,
    companyHR: req.userId,
  });
  if (!excistCompany) {
    return next(new AppError("company owner only can update", 403));
  }
  const deleted = await companyModel.findByIdAndDelete(req.params.id);
  deleted &&
    res
      .status(200)
      .json({ message: "Succes", deleted: "company has been deleted" });
  !deleted && next(new AppError("company not found", 404));
});

const getByIdCompanyData = handleError(async (req, res, next) => {
  let { id } = req.params;

  let company = await companyModel.findById(id);
  if (!company) {
    return next(new AppError("company not found", 404));
  }

  let excistUser = await companyModel.findOne({ companyHR: req.userId });
  if (!excistUser) {
    return next(new AppError("company Hr not found", 404));
  }
  const companyData = await companyModel
    .findById(id)
    .populate("companyHR", "username email")
    .populate("jobs");
  companyData && res.status(200).json({ message: "Succes", companyData });
  !companyData && next(new AppError("company not found", 404));
});

const getCompanyWithName = handleError(async (req, res, next) => {
  let excistUser = await userModel.findById(req.userId);
  if (!excistUser) {
    return next(new AppError("user not found", 404));
  }
  let { companyName } = req.params;
  const companyData = await companyModel
    .find({ companyName })
    .populate("companyHR", "username email")
    .populate("jobs");
  companyData && res.status(200).json({ message: "Succes", companyData });
  !companyData && next(new AppError("no data found", 404));
});

const getJobApplications = handleError(async (req, res, next) => {
  let { id } = req.params;
  const job = await jobModel.findById(id);
  if (!job) {
    return next(new AppError("job not found", 404));
  }
  const companyOwner = await applicationModel.findOne({ addedBy: req.userId });
  if (!companyOwner) {
    return next(new AppError("company owner can access", 403));
  }
  const apllicationData = await applicationModel
    .find({ job: id })
    .populate("user")
    .populate("addedBy", "username email -_id");

  apllicationData.length &&
    res.status(200).json({ message: "Succes", apllicationData });
  !apllicationData.length && next(new AppError("apllication not found", 404));
});

export {
  addCompany,
  updateCompanyData,
  deleteCompany,
  getByIdCompanyData,
  getCompanyWithName,
  getJobApplications,
};
