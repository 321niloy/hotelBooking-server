import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TGuest } from './guest.interface';
import { Guest } from './guest.model';

const createGuestIntoDB = async (payload: TGuest) => {
  const existingGuest = await Guest.findOne({ userId: payload.userId });
  if (existingGuest) {
    throw new AppError(httpStatus.BAD_REQUEST, 'A guest profile already exists for this user!');
  }

  const result = await Guest.create(payload);
  return result;
};

const updateGuestInDB = async (id: string, payload: Partial<TGuest>) => {
  const guest = await Guest.findById(id);

  if (!guest || guest.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'This guest profile is not found!');
  }

  const result = await Guest.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

export const GuestServices = {
  createGuestIntoDB,
  updateGuestInDB,
};
