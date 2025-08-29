import createHttpError from 'http-errors';

import { UsersCollection } from '../db/models/User.js';
import { ROLES } from '../constants/index.js';

export const checkRoles =
  (...roles) =>
  async (req, res, next) => {
    const { user } = req;
    if (!user) {
      return next(createHttpError(401));
    }

    if (roles.includes(user.role)) {
      return next();
    }

    return next(createHttpError(403, 'Forbidden'));
  };
