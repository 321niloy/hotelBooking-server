/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser {
  _id: Types.ObjectId;
  email: string;
  password?: string;
  role: 'guest' | 'manager' | 'admin';
  status: 'active' | 'blocked';
  isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<TUser | null>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
