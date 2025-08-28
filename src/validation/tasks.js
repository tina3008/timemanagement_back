import Joi from 'joi';

export const schemaTaskPost = Joi.object({
  name: Joi.string().min(3).max(20).required(),

  phoneNumber: Joi.string()
    .min(3)
    .max(20)
    .pattern(/[+*0-9]{3,20}$/)
    .required(),

  email: Joi.string()
    .min(3)
    .max(20)
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    }),

  isFavourite: Joi.boolean(),

  taskType: Joi.string().valid('work', 'home', 'personal').required(),
});

export const schemaTaskPatch = Joi.object({
  name: Joi.string().min(3).max(20),

  phoneNumber: Joi.string()
    .min(3)
    .max(20)
    .pattern(/[+*0-9]{3,20}$/),

  email: Joi.string()
    .min(3)
    .max(20)
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    }),

  isFavourite: Joi.boolean(),

  taskType: Joi.string().valid('work', 'home', 'personal'),
});
