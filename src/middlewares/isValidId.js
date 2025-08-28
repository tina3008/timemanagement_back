import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidID = (req, res, next) => {
  const { contactId } = req.params;
  console.log('contactId- ', contactId);
  if (!isValidObjectId(contactId)) {
    throw createHttpError(404, `Not found`);
  }

  next();
};

