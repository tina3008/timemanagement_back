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
  console.log('taskId:', taskId, 'req.user:', req.user);
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

  const taskFields = {
    task: req.body.task,
    timeDeclaration: req.body.timeDeclaration,
    timeReal: req.body.timeReal,
    taskType: req.body.taskType,
    date: req.body.date,
    status:req.body.status,
    userId: req.user._id,
  };
  const task = await createTask(taskFields);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a task!',
    data: task,
  });
};

// export const deleteTaskController = async (req, res) => {
//   const { taskId } = req.params;
// console.log('taskId:', taskId, 'req.user---:', req.user._id);
//   const task = await deleteTask(taskId, req.user._id);

//   if (!task) {
//     throw createHttpError(404, 'Task not found');
//   }

//   res.status(204).send();
// };

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

  const result = await patchTask(taskId, req.user._id, {
    ...req.body,

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
