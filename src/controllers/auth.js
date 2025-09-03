import {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
  requestResetToken,
  resetPassword,
  loginOrSignupWithGoogle,
  getInfoUserService,
} from '../services/auth.js';
// import { ONE_DAY } from '../constants/index.js';
import { generateAuthUrl } from '../utils/googleOAuth2.js';
import { log } from 'node:console';

import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import { UsersCollection } from '../db/models/User.js';
import { SessionsCollections } from '../db/models/Session.js';

async function register(req, res) {
  const registeredUser = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    // data: registeredUser,
    data: {
      name: registeredUser.name,
      email: registeredUser.email,
      id: registeredUser._id,
      createdAt:registeredUser.createdAt,
      updatedAt:registeredUser.updatedAt,
    },
  });
}

// async function login(req, res) {
//   const session = await loginUser(req.body);

//   res.cookie('refreshToken', session.refreshToken, {
//     httpOnly: true,
//     expires: new Date(Date.now() + ONE_DAY),
//   });
//   res.cookie('sessionId', session._id, {
//     httpOnly: true,
//     expires: new Date(Date.now() + ONE_DAY),
//   });

// res.json({
//   status: 200,
//   message: 'Successfully logged in a user!',
//   data: {
//     accessToken: session.accessToken,
//   },
// });
// };

async function login(req, res) {
  const session = await loginUser(req.body);

  // refreshToken
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: true, // включить на https
    sameSite: 'strict',
    expires: new Date(Date.now() + ONE_DAY),
  });

  // sessionId
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + ONE_DAY),
  });

  // accessToken тоже можно в куку
  res.cookie('accessToken', session.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + FIFTEEN_MINUTES),
  });

  res.json({
    status: 200,
    message: 'Successfully logged in a user!',
    user: {
      id: session.userId,
    },
      data: {
        accessToken: session.accessToken,
      },
  });
}

async function logout(req, res) {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  };

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
};

export const refreshSessionController = async (req, res) => {
  const session = await refreshSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};


export const requestResetEmailController = async(req, res) => {
  await requestResetToken(req.body.email)

  res.json({
    message: 'Reset password email was successfully sent!',
    status: 200,
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};

export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();
  res.json({
    status: 200,
    message: 'Successfully get Google OAuth url!',
    data: {
      url,
    },
  });
};

export const loginWithGoogleController = async (req, res) => {
  const session = await loginOrSignupWithGoogle(req.body.code);
  setupSession(res, session);

 res.cookie('accessToken', session.accessToken, {
   httpOnly: true,
   secure: process.env.NODE_ENV === 'production',
   sameSite: 'lax', // нужно для Google redirect
   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
 });
  res.json({
    status: 200,
    message: 'Successfully logged in via Google OAuth!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const getInfoUserController = async (req, res) => {
  const userId = req.user._id;
  const user = await getInfoUserService(userId);
console.log('userId---', userId);

  res.status(200).json({
    status: 200,
    data: user,
  });
};

export { register, login, logout };


export const getCurrentUser = async (req, res) => {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const session = await SessionsCollections.findById(sessionId).populate(
    'userId',
  );
  if (!session) {
    return res.status(401).json({ message: 'Session not found' });
  }

  const user = session.userId;

   res.status(200).json({
     status: 200,
     data: user,
   });
};
