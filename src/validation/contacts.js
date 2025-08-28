import Joi from 'joi';

export const schemaContactPost = Joi.object({
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

  contactType: Joi.string().valid('work', 'home', 'personal').required(),
});

export const schemaContactPatch = Joi.object({
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

  contactType: Joi.string().valid('work', 'home', 'personal'),
});
