

export const globalError= (err,req,res,next)=>{
    console.log("global error handling",err);
    process.env.MODE=='dev'?
     res.status(err.statusCode ? err.statusCode : 500).json({message:'error',err:err.message?
     err.message :err,stack:err.stack}):
     res.status(err.statusCode  ? err.statusCode : 500).json({message:'error',err:err.message})


}

