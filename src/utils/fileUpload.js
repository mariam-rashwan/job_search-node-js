
import mongoose from "mongoose";
import multer from 'multer';
import { AppError } from './AppError.js';

export const fileUpload=(fieldName)=>{
  const storage = multer.diskStorage({
    // destination:(req, file, cb)=> {
    //   cb(null, 'uploads/')
    // },
    // filename:(req, file, cb) =>{
    //   cb(null,new mongoose.Types.ObjectId() + "_" +file.originalname)
    // }
    //to just upload in cloudinary
  })
  
  function fileFilter (req, file, cb) {
  
    console.log("file",file);
    // application/pdf
    if(file.mimetype === 'application/pdf'){
      cb(null, true)
    }else{
      cb(new AppError('only PDF files are allowed',401), false)
  
    }
  
  
  
  }
  const upload = multer({ storage,fileFilter })
  
  return upload
  // .single(fieldName)
  
}

export const uploadSingle = (fieldName) => fileUpload().single(fieldName);
export const uploadArray = (fieldName) => fileUpload().array(fieldName, 10);
export const uploadFields = (fieldName) => fileUpload().fields(fieldName);
