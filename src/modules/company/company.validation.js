import Joi from "joi";

export const addCompanySchema = Joi.object({
  companyName: Joi.string().min(2).max(30).required().trim(),
  description: Joi.string().min(5).max(200),
  industry: Joi.string().min(2),
  address:Joi.string().min(2).max(80).trim(),
  numberOfEmployees:Joi.number().min(11).max(20),
  companyEmail: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .required(),

});

export const updateCompanySchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
  companyName: Joi.string().min(2).max(30).trim(),
  description: Joi.string().min(5).max(200),
  industry: Joi.string().min(2),
  address:Joi.string().min(2).max(80).trim(),
  numberOfEmployees:Joi.number().min(11).max(20),
  companyEmail: Joi.string().email({ minDomainSegments: 2, tlds: { allow: false } }),

});

export const IdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});


export const companyNameSchema = Joi.object({
  companyName: Joi.string().min(2).max(30).trim(),
});


export const emailSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .required(),
});

