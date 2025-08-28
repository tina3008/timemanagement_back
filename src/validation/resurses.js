import Joi from "joi";

export const validResursesSchema = Joi.object({
  note: Joi.string().min(3).max(1000),
});
