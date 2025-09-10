import {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
  requestResetToken,
  changePassword,
  loginOrSignupWithGoogle,
  getInfoUserService,
  patchUser,
} from '../services/auth.js';
import { generateAuthUrl } from '../utils/googleOAuth2.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import { SessionsCollections } from '../db/models/Session.js';
import { env } from '../utils/env.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import createHttpError from 'http-errors';

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
      createdAt: registeredUser.createdAt,
      updatedAt: registeredUser.updatedAt,
    },
  });
}

async function login(req, res) {
  const session = await loginUser(req.body);

  // refreshToken
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    // secure: true,
    // sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    expires: new Date(Date.now() + ONE_DAY),
  });

  // sessionId
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    // secure: true,
    // sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.cookie('accessToken', session.accessToken, {
    httpOnly: true,
    // secure: true,
    // sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
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
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
}

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

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);

  res.json({
    message: 'Reset password email was successfully sent!',
    status: 200,
    data: {},
  });
};

export const changePasswordController = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  await changePassword(req.user._id, oldPassword, newPassword);
  res.json({
    message: 'Password was successfully changed!',
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
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({
    status: 200,
    message: 'Successfully logged in via Google OAuth!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

// export const loginWithGoogleController = async (req, res) => {
//   const session = await loginOrSignupWithGoogle(req.body.code);
//   setupSession(res, session);

//   res.cookie('accessToken', session.accessToken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'lax',
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//   });

//   res.redirect(`http://localhost:3000/oauth-success`);
// };

export const getInfoUserController = async (req, res) => {
  const userId = req.user._id;
  const user = await getInfoUserService(userId);

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




export const changeUserController = async (req, res, next) => {
    const userId = req.user._id;

  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

 const result = await patchUser(userId, {
    ...req.body,
    photo: photoUrl,
  });

  if (!result) {
    next(createHttpError(404, `User not found ${userId}`));
    return;
  }
  res.json({
    status: 200,
    message: 'Successfully patched a User!',
    data: result.user,
  });
};
