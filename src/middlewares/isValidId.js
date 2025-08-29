import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidID = (req, res, next) => {
  const { taskId } = req.params;
  console.log('taskId →', taskId);

  if (!isValidObjectId(taskId)) {
    throw createHttpError(404, `Invalid ID`);
  }

  next();
};

export const isValidNoteID = (req, res, next) => {
  const { noteId } = req.params;
  console.log('noteId →', noteId);

  if (!isValidObjectId(noteId)) {
    throw createHttpError(404, `Invalid ID`);
  }

  next();
};

export const isValidResursesID = (req, res, next) => {
  const { resurseId } = req.params;
  console.log('resurseId →', resurseId);

  if (!isValidObjectId(resurseId)) {
    throw createHttpError(404, `Invalid ID`);
  }

  next();
};
