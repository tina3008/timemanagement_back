import Joi from 'joi';

export const validResursesSchema = Joi.object({
  resurseName: Joi.string().min(3).max(100),
  resurse: Joi.string().min(3).max(1000),
  category: Joi.string().min(3).max(100),

});
