import Joi from "joi";

export const applayApplicationSchema = Joi.object({
  id:Joi.string().hex().length(24).required(),
  userTechSkills:Joi.string(),
  userSoftSkills:Joi.string(),
  userResume:Joi.string(),
  image: Joi.optional()


});
