import createHttpError from 'http-errors';
import { SessionsCollections } from '../db/models/Session.js';
import { UsersCollection } from '../db/models/User.js';

export const authenticate = async (req, res, next) => {
  // const authHeader = req.get('Authorization');

  // if (!authHeader) {
  //   next(createHttpError(401, 'Please provide Authorization header'));
  //   return;
  // }

  // const bearer = authHeader.split(' ')[0];
  // const token = authHeader.split(' ')[1];

  // if (bearer !== 'Bearer' || !token) {
  //   next(createHttpError(401, 'Auth header should be of type Bearer'));
  //   return;
  // }
  
    let token;

    // 1. пробуем достать токен из Authorization
    const authHeader = req.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2. если нет, берём из cookies
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return next(createHttpError(401, "No access token provided"));
    }
  const session = await SessionsCollections.findOne({ accessToken: token });

  if (!session) {
    next(createHttpError(401, 'Session not found'));
    return;
  }

  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);

  if (isAccessTokenExpired) {
    next(createHttpError(401, 'Access token expired'));
  }

  const user = await UsersCollection.findById(session.userId);

  if (!user) {
    next(createHttpError(401));
    return;
  }

  req.user = user;

  next();
};
