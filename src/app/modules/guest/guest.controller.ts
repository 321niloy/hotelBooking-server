import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { GuestServices } from './guest.service';

const createGuest = catchAsync(async (req: Request, res: Response) => {
  const result = await GuestServices.createGuestIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Guest created successfully!',
    data: result,
  });
});

const updateGuest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await GuestServices.updateGuestInDB(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Guest updated successfully!',
    data: result,
  });
});

export const GuestControllers = {
  createGuest,
  updateGuest,
};
