import { Model, Types } from 'mongoose';

export type TGuest = {
  userId: Types.ObjectId; // References the User model
  name: string;
  phone: string;
  passportNumber: string;
  isDeleted: boolean;
};

export type GuestModel = Model<TGuest, Record<string, never>>;
