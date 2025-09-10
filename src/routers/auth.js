import { Router } from 'express';
import {
  register,
  login,
  logout,
  refreshSessionController,
  requestResetEmailController,
  // resetPasswordController,
  getGoogleOAuthUrlController,
  loginWithGoogleController,
  getInfoUserController,
  getCurrentUser,
  changePasswordController,
} from '../controllers/auth.js';
import { ctrlWrapper } from '../middlewares/ctrlWrapper.js';
import {
  validUserSchema,
  loginSchema,
  requestResetEmailSchema,
  // resetPasswordSchema,
  changePasswordSchema,
  loginWithGoogleOAuthSchema,
} from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
const authRouter = Router();
// const jsonParser = json();

authRouter.post(
  '/register',
  validateBody(validUserSchema),
  ctrlWrapper(register),
);

authRouter.post('/login', validateBody(loginSchema), ctrlWrapper(login));

authRouter.post('/logout', ctrlWrapper(logout));

authRouter.post('/refresh', ctrlWrapper(refreshSessionController));
authRouter.get('/me', authenticate, ctrlWrapper(getInfoUserController));
// router.get('/me', authenticate, ctrlWrapper(getCurrentUser));

authRouter.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

authRouter.post(
  '/change-pwd',
  authenticate,
  validateBody(changePasswordSchema),
  ctrlWrapper(changePasswordController),
);

authRouter.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));

authRouter.post(
  '/confirm-auth',
  validateBody(loginWithGoogleOAuthSchema),
  ctrlWrapper(loginWithGoogleController),
);

export default authRouter;
