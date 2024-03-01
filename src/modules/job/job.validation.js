import Joi from "joi";

export const addJobSchema = Joi.object({
  jobTitle: Joi.string().min(2).max(50).required().trim(),
  jobLocation: Joi.string().valid("onsite", "remotely", "hybrid").optional(),
  workingTime:Joi.string().valid("part-time", "full-time").optional(),
  seniorityLevel:Joi.string().valid("Junior","Mid-Level","Senior","Team-Lead","CTO"),
  jobDescription: Joi.string().min(5).max(400),
  technicalSkills:Joi.array().items(Joi.string()),
  softSkills:Joi.array().items(Joi.string())
});


export const updateJobSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
  jobTitle: Joi.string().min(2).max(50).trim(),
  jobLocation: Joi.string().valid("onsite", "remotely", "hybrid"),
  workingTime:Joi.string().valid("part-time", "full-time"),
  seniorityLevel:Joi.string().valid("Junior","Mid-Level","Senior","Team-Lead","CTO"),
  jobDescription: Joi.string().min(5).max(400),
  technicalSkills:Joi.array().items(Joi.string()),
  softSkills:Joi.array().items(Joi.string())

});



export const validateIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const validatCompanyNameSchema = Joi.object({
  companyName:Joi.string().min(2).max(50).required().trim(),
});


export const filterJobSchema = Joi.object({
  jobTitle: Joi.string().min(2).max(50).trim(),
  jobLocation: Joi.string().valid("onsite", "remotely", "hybrid"),
  workingTime:Joi.string().valid("part-time", "full-time"),
  seniorityLevel:Joi.string().valid("Junior","Mid-Level","Senior","Team-Lead","CTO"),
  // technicalSkills:Joi.array().items(Joi.string()),
  technicalSkills:Joi.optional(),


});


