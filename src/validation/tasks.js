import Joi from 'joi';

export const schemaTaskPost = Joi.object({
  task: Joi.string().min(3).max(200).required().messages({
    'string.empty': 'Task is a required field',
    'string.min': 'Task must have at least 3 symbols',
    'string.max': 'Task is too long',
  }),

  timeDeclaration: Joi.number().integer().min(1).required().messages({
    'number.base': 'Time must be number',
    'number.min': 'Minimum time — 1',
    'any.required': 'Time is a required field',
  }),

  taskType: Joi.string().valid('work', 'home', 'personal').required().messages({
    'any.only': 'Type can be work, home or personal',
    'any.required': 'Type is a required field',
  }),

  date: Joi.date().required().messages({
    'date.base': 'Date must be a valid date',
    'any.required': 'Date is a required field',
  }),
  status: Joi.string()
    .valid('completed', 'pending', 'working')
    .messages({
      'any.only': 'Type can be completed, pending, working',
      'any.required': 'Type is a required field',
    }),
  userId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'userId must be a valid ObjectId',
      'any.required': 'userId is required',
    }),
});


export const schemaTaskPatch = Joi.object({
  task: Joi.string().min(3).max(200).optional(),

  timeDeclaration: Joi.number().integer().min(1).optional(),

  timeReal: Joi.number().integer().min(0).optional(),

  taskType: Joi.string().valid('work', 'home', 'personal').optional(),
  date: Joi.date().optional().messages({
    'date.base': 'Date must be a valid date',
  }),
  status: Joi.string()
    .valid('completed', 'pending', 'working')
    .optional()
    .messages({
      'any.only': 'Type can be completed, pending, working',
      'any.required': 'Type is a required field',
    }),
  userId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
});
