import { Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken, accessToken } = result;

  // Set refresh token in secure HTTP-Only cookie
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in successfully!',
    data: {
      accessToken,
    },
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.changePassword(req.body);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password is updated successfully!',
    data: result,
  });
});


const refreshToken = catchAsync(async (req: Request, res: Response) => {
  // Extract token from request cookies
  const { refreshToken: tokenFromCookie } = req.cookies;
  
  if (!tokenFromCookie) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Refresh token is missing!');
  }

  const result = await AuthServices.refreshToken(tokenFromCookie);
  const { accessToken, refreshToken: newRefreshToken } = result;

  // Overwrite the old cookie with the fresh rotated refresh token
  res.cookie('refreshToken', newRefreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved successfully!',
    data: {
      accessToken,
    },
  });
});

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  // Uses email instead of a custom user ID to match database architecture
  const { email } = req.body;
  
  if (!email) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email is required!');
  }

  const result = await AuthServices.forgetPassword(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reset link is generated successfully!',
    data: result,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  let token = req.headers.authorization;

  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Authorization token is missing!');
  }

  // Optional: Clean up 'Bearer ' prefix if passed from front-end headers
  if (token.startsWith('Bearer ')) {
    token = token.split(' ')[1];
  }

  const result = await AuthServices.resetPassword(req.body, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset successfully!',
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
