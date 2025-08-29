import { Router } from 'express';
import express from 'express';
import {
  getTaskIDController,
  getTasksController,
  createTaskController,
  deleteTaskController,
  changeTaskController,
} from '../controllers/tasks.js';
import { ctrlWrapper } from '../middlewares/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  schemaTaskPost,
  schemaTaskPatch,
} from '../validation/tasks.js';
import { isValidID } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkRoles } from '../middlewares/checkRoles.js';
import { ROLES } from '../constants/index.js';

const tasksRouter = Router();
// const jsonParser = express.json();

tasksRouter.use(authenticate);

tasksRouter.get('/', ctrlWrapper(getTasksController));

tasksRouter.get(
  '/:taskId',
  authenticate,
  isValidID,
  checkRoles(ROLES.AUTOR),
  ctrlWrapper(getTaskIDController),
);

tasksRouter.post(
  '/',
  validateBody(schemaTaskPost),
  ctrlWrapper(createTaskController),
);


tasksRouter.delete(
  '/:taskId',
  authenticate,
  isValidID,
  checkRoles(ROLES.AUTOR),
  ctrlWrapper(deleteTaskController),
);

tasksRouter.patch(
  '/:taskId',
  checkRoles(ROLES.AUTOR),
  validateBody(schemaTaskPatch),
  ctrlWrapper(changeTaskController),
);

export default tasksRouter;
