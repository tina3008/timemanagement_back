import Joi from "joi";

export const validNotesSchema = Joi.object({
  note: Joi.string().min(3).max(1000),
});



