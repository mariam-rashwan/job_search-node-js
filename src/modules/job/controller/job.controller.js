import { handleError } from "../../../middleware/handleError.js";
import { AppError } from "../../../utils/AppError.js";
import companyModel from "../../../../DB/models/company.model.js";
import jobModel from "./../../../../DB/models/job.model.js";
import userModel from "../../../../DB/models/user.model.js";

// create job

const addJob = handleError(async (req, res, next) => {
  let {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body;
  req.body.addedBy = req.userId;
  const excistCompanyHr = await companyModel.findOne({ companyHR: req.userId });
  if (!excistCompanyHr) {
    return next(new AppError("company hr must add the job", 401));
  }

  let hrCompany = await userModel.findById(req.userId);
  req.body.company = hrCompany.company;

  let newJob = new jobModel(req.body);
  console.log(newJob);
  const added = await newJob.save();
  let {_id}=added
  await companyModel.findByIdAndUpdate(
    hrCompany.company,
    { $push: { jobs: _id } },
    { new: true }

    // { $push: { jobs: { jobsData: _id } } },
  );
  return res.status(201).json({ message: "Succes", added });
});

// update job

const updateJob = handleError(async (req, res, next) => {
  let {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body;

  const job = await jobModel.findById(req.params.id)
  if (!job) {
    return next(new AppError("job not found", 404));
  }
  const excistCompanyHr = await companyModel.findOne({ companyHR: req.userId });
  if (!excistCompanyHr) {
    return next(new AppError("company hr not found", 404));
  }

  let excistCompanyJob=await jobModel.findOne({ addedBy: req.userId ,_id:req.params.id});
  if (!excistCompanyJob) {
    return next(new AppError("company owner only can update", 403));
  }

  let updated = await jobModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  updated && res.status(200).json({ message: "Succes", updated });
  !updated && next(new AppError("job not found", 404));
});

const deleteJob = handleError(async (req, res, next) => {
  let { id } = req.params;

  const job = await jobModel.findById(req.params.id)
  if (!job) {
    return next(new AppError("job not found", 404));
  }
  const excistCompanyHr = await jobModel.findOne({ addedBy: req.userId });
  if (!excistCompanyHr) {
    return next(new AppError("company hr not found", 404));
  }
  let excistCompanyJob=await jobModel.findOne({ addedBy: req.userId ,_id:req.params.id});
  if (!excistCompanyJob) {
    return next(new AppError("company owner only can update", 403));
  }

  let deleted = await jobModel.findByIdAndDelete(id);
  deleted &&
    res.status(200).json({ message: "Succes", deleted: "job deleted" });
  !deleted && next(new AppError("job not found", 404));
});

const getAllJobs = handleError(async (req, res, next) => {
  const excistUser= await userModel.findById(req.userId);
  if (!excistUser) {
    return next(new AppError("user not found", 404));
  }
  let allJobs = await jobModel.find().populate('company').populate('addedBy','username email mobileNumber');
  allJobs && res.status(200).json({ message: "Succes", allJobs });
  !allJobs && next(new AppError("job not found", 404));
});

const getAllCompanyNameJobs = handleError(async (req, res, next) => {
  const companyName = req.query.companyName;

  const excistUser= await userModel.findById(req.userId);
  if (!excistUser) {
    return next(new AppError("user not found", 404));
  }
  let Company=await companyModel.findOne({companyName});
  if (!Company) {
    return next(new AppError("company not found", 404));
  }

  let CompanyJobs=await companyModel.find({companyName}).select('jobs -_id').populate('jobs');
 return  res.status(200).json({ message: "Succes", CompanyJobs });

});


// Note ==> send technicalSkills in query params =>
//  technicalSkills=html,css,javaScript

const filterJobs = handleError(async (req, res, next) => {
  const excistUser= await userModel.findById(req.userId);
  if (!excistUser) {
    return next(new AppError("user not found", 404));
  }
if(req.query.technicalSkills){
 let  data= req.query.technicalSkills.split(',');
  req.query.technicalSkills=data
}
let Jobs=await jobModel.find(req.query);
  Jobs.length && res.status(200).json({ message: "Succes", Jobs });
  !Jobs.length && next(new AppError("jobs not matched", 404));
});


export { addJob, updateJob, deleteJob, getAllJobs,getAllCompanyNameJobs,filterJobs };
