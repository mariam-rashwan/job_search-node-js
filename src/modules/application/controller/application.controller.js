import userModel from "../../../../DB/models/user.model.js";
import { handleError } from "../../../middleware/handleError.js";
import { AppError } from "../../../utils/AppError.js";
import applicationModel from './../../../../DB/models/application.model.js';
import jobModel from './../../../../DB/models/job.model.js';


import {v2 as cloudinary} from 'cloudinary';
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.API_KEY_CLOUDINARY, 
  api_secret: process.env.CLOUDINARY_SK_KEY,
});



const applyToJob = handleError(async (req, res, next) => {

  const excistUser= await userModel.findById(req.userId);
  if (!excistUser) {
    return next(new AppError("user not found", 404));
  }

  const excistJob= await jobModel.findById(req.params.id);
  if (!excistJob) {
    return next(new AppError("job not found", 404));
  }
   req.body.user=req.userId;
   req.body.job=req.params.id;
   req.body.addedBy=excistJob.addedBy;
   req.body.userSoftSkills=JSON.parse(req.body.userSoftSkills)
   req.body.userTechSkills=JSON.parse(req.body.userTechSkills)
   
   if(!req.file.path){
    return next(new AppError("please upload file", 400));

   }
   cloudinary.uploader.upload(req.file.path,{ resource_type: 'auto' },async (error, result)=> {
    if(error){
    return next(new AppError("faild to upload file", 500));

    }
    // let test=result.secure_url.replace(/\.ai$/, '.pdf')
    req.body.userResume=result.secure_url
    let newApplication=new applicationModel(req.body);
    const added = await newApplication.save();
    
    return res.status(200).json({ message: "Succes",added });
  
  });

 });



 export {
    applyToJob
 
  };