import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  patchTask,
} from '../services/tasks.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';

export const getTasksController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const tasks = await getAllTasks({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user._id,
  });

  res.json({
    status: 200,
    message: 'Successfully found tasks!',
    data: tasks,
  });
};

export const getTaskIDController = async (req, res, next) => {
  const { taskId } = req.params;
  const task = await getTaskById(taskId, req.user._id);

  if (!task) {
    throw createHttpError(404, `Task not found, ${taskId}`);
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found task with id ${taskId}!`,
    data: task,
  });
};

export const createTaskController = async (req, res) => {
   const photo = req.file;

   let photoUrl;

   if (photo) {
     if (env('ENABLE_CLOUDINARY') === 'true') {
       photoUrl = await saveFileToCloudinary(photo);
     } else {
       photoUrl = await saveFileToUploadDir(photo);
     }
   }
  const taskFields = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    taskType: req.body.taskType,
    userId: req.user._id,
    photo: photoUrl,
  };
  const task = await createTask(taskFields);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a task!',
    data: task,
  });
};

export const deleteTaskController = async (req, res) => {
  const { taskId } = req.params;

  const task = await deleteTask(taskId, req.user._id);

  if (!task) {
    throw createHttpError(404, 'Task not found');
  }

  res.status(204).send();
};

export const changeTaskController = async (req, res, next) => {
  const { taskId } = req.params;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const result = await patchTask(taskId, req.user._id, {
    ...req.body,
    photo: photoUrl,
  });

  if (!result) {
    next(createHttpError(404, `Task not found ${taskId}`));
    return;
  }

  res.json({
    status: 200,
    message: 'Successfully patched a task!',
    data: result.task,
  });
};
