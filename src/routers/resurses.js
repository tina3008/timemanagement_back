import { Router } from 'express';
import express from 'express';
import {
  getResurseIDController,
  getResursesController,
  createResurseController,
  deleteResurseController,
  changeResurseController,
} from '../controllers/resurses.js';
import { ctrlWrapper } from '../middlewares/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { validResursesSchema } from '../validation/resurses.js';
import { isValidResursesID } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkRoles } from '../middlewares/checkRoles.js';
import { ROLES } from '../constants/index.js';
import { upload } from '../middlewares/multer.js';

const resursesRouter = Router();
// const jsonParser = express.json();

resursesRouter.use(authenticate);

resursesRouter.get('/', ctrlWrapper(getResursesController));
//  resursesRouter.get('/', (req, res) => {
//    res.json({
//      message: 'this is resurses!',
//    });
//  });

resursesRouter.get(
  '/:resurseId',
  checkRoles(ROLES.AUTOR),
  isValidResursesID,
  ctrlWrapper(getResurseIDController),
);

resursesRouter.post(
  '/',
  validateBody(validResursesSchema),
  ctrlWrapper(createResurseController),
);
resursesRouter.delete(
  '/:resurseId',
  isValidResursesID,
  checkRoles(ROLES.AUTOR),
  ctrlWrapper(deleteResurseController),
);
resursesRouter.patch(
  '/:resurseId',
  checkRoles(ROLES.AUTOR),
  validateBody(validResursesSchema),
  ctrlWrapper(changeResurseController),
);

export default resursesRouter;
