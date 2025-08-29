import Joi from 'joi';

export const validNotesSchema = Joi.object({
  note: Joi.string().min(3).max(1000),
  userId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'userId must be a valid ObjectId',
      'any.required': 'userId is required',
    }),
});
