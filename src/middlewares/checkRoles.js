import createHttpError from 'http-errors';

import ContactsCollection from '../db/models/contact.js';
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
      const { contactId } = req.params;
      if (!contactId) {
        next(createHttpError(404));
        return;
      }

      const contact = await ContactsCollection.findOne({
        _id: contactId,
        userId: user._id,
      });

      if (contact) {
        next();
        return;
      }
    }

    next(createHttpError(404));
  };
