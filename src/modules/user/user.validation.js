import Joi from "joi";

export const addUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(15).required(),
  lastName: Joi.string().min(2).max(15).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .required(),
  recoveryEmail: Joi.string().email({ tlds: { allow: false } }),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required()
    .messages({
      "string.pattern.base": `Password should be between 3 to 30 characters and contain letters or numbers only`,
      "string.empty": `Password cannot be empty`,
      "any.required": `Password is required`,
    }),
  mobileNumber: Joi.string()
    .regex(/^[0-9]{11}$/)
    .messages({ "string.pattern.base": `Phone number must have 11 digits.` })
    .required(),
  status: Joi.string().valid("online", "offline").optional(),
  // there is two ways to validate the DOB
  //==> this
  DOB: Joi.date()
    .max("01-01-2014")
    .iso()
    .messages({
      "date.format": `Date format is YYYY-MM-DD`,
      "date.max": `Age must be 10+`,
    }),
    //==> that ==>
    // DOB: Joi.string().regex(/^\d{4}-\d{2}-\d{1,2}$/).error(new Error('Date of birth must be in the format YYYY-MM-DD')),
   
    role: Joi.string().valid("User", "Company_HR").optional(),
});


export const signInSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: false } }),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required()
    .messages({
      "string.pattern.base": `Password should be between 3 to 30 characters and contain letters or numbers only`,
      "string.empty": `Password cannot be empty`,
      "any.required": `Password is required`,
    }),
  mobileNumber: Joi.string()
    .regex(/^[0-9]{11}$/)
    .messages({ "string.pattern.base": `Phone number must have 11 digits.` }),
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(15),
  lastName: Joi.string().min(2).max(15),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: false } }),
  recoveryEmail: Joi.string().email({ tlds: { allow: false } }),
  mobileNumber: Joi.string()
    .regex(/^[0-9]{11}$/)
    .messages({ "string.pattern.base": `Phone number must have 11 digits.` }),
  DOB: Joi.date().max("01-01-2014").iso().messages({
    "date.format": `Date format is YYYY-MM-DD`,
    "date.max": `Age must be 10+`,
  }),
});
export const getByIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required()
    .messages({
      "string.pattern.base": `Password should be between 3 to 30 characters and contain letters or numbers only`,
      "string.empty": `Password cannot be empty`,
      "any.required": `Password is required`,
    }),
    newPassword: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required()
    .messages({
      "string.pattern.base": `Password should be between 3 to 30 characters and contain letters or numbers only`,
      "string.empty": `Password cannot be empty`,
      "any.required": `Password is required`,
    }),
});

export const recoveryEmailSchema = Joi.object({
  recoveryEmail: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
});

export const emailSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required()
    .messages({
      "string.pattern.base": `Password should be between 3 to 30 characters and contain letters or numbers only`,
      "string.empty": `Password cannot be empty`,
      "any.required": `Password is required`,
    }),
  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required(),
});
