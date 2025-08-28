import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidID = (req, res, next) => {
  const { taskId } = req.params;
  console.log('taskId- ', taskId);
  if (!isValidObjectId(taskId)) {
    throw createHttpError(404, `Not found`);
  }

  next();
};

