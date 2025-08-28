import { Router } from 'express';
import express from 'express';
import {
  getContactIDController,
  getContactsController,
  createContactController,
  deleteContactController,
  changeContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../middlewares/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  schemaContactPost,
  schemaContactPatch,
} from '../validation/contacts.js';
import { isValidID } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkRoles } from '../middlewares/checkRoles.js';
import { ROLES } from '../constants/index.js';
import { upload } from '../middlewares/multer.js';

const router = Router();
// const jsonParser = express.json();

router.use(authenticate);

router.get('/', ctrlWrapper(getContactsController));

router.get(
  '/:contactId',

  checkRoles(ROLES.AUTOR),
  isValidID,
  ctrlWrapper(getContactIDController),
);

router.post(
  '/',
  upload.single('photo'),
  validateBody(schemaContactPost),
  ctrlWrapper(createContactController),
);
router.delete(
  '/:contactId',
  isValidID,
  checkRoles(ROLES.AUTOR),
  ctrlWrapper(deleteContactController),
);
router.patch(
  '/:contactId',

  upload.single('photo'),
  checkRoles(ROLES.AUTOR),
  validateBody(schemaContactPatch),
  ctrlWrapper(changeContactController),
);

export default router;
