import { Router } from 'express';
import express from 'express';
import {
  getNoteIDController,
  getNotesController,
  createNoteController,
  deleteNoteController,
  changeNoteController,
} from '../controllers/notes.js';
import { ctrlWrapper } from '../middlewares/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { validNotesSchema} from '../validation/notes.js';
import { isValidNoteID } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkRoles } from '../middlewares/checkRoles.js';
import { ROLES } from '../constants/index.js';

const notesRouter = Router();
// const jsonParser = express.json();

notesRouter.use(authenticate);

notesRouter.get('/', ctrlWrapper(getNotesController));

notesRouter.get(
  '/:noteId',

  checkRoles(ROLES.AUTOR),
  isValidNoteID,
  ctrlWrapper(getNoteIDController),
);

notesRouter.post(
  '/',
  validateBody(validNotesSchema),
  ctrlWrapper(createNoteController),
);
notesRouter.delete(
  '/:noteId',
  isValidNoteID,
  checkRoles(ROLES.AUTOR),
  ctrlWrapper(deleteNoteController),
);
notesRouter.patch(
  '/:noteId',
  checkRoles(ROLES.AUTOR),
  validateBody(validNotesSchema),
  ctrlWrapper(changeNoteController),
);

export default notesRouter;
