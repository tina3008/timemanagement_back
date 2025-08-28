import createHttpError from 'http-errors';

import TimeMnmtCollection from '../db/models/tasks.js';
import { ROLES } from '../constants/index.js';

export const checkRoles =
  (...roles) =>
  async (req, res, next) => {
    const { user } = req;
    if (!user) {
      next(createHttpError(401));
      return;
    }

    const { role } = user;

    if (roles.includes(ROLES.AUTOR) && role === ROLES.AUTOR) {
      const { timeMnmtId } = req.params;
      if (!timeMnmtId) {
        next(createHttpError(404));
        return;
      }

      const timeMnmt = await TimeMnmtCollection.findOne({
        _id: timeMnmtId,
        userId: user._id,
      });

      if (timeMnmt) {
        next();
        return;
      }
    }

    next(createHttpError(404));
  };
