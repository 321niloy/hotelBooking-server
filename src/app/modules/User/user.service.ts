/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '../../config';
import AppError from '../../errors/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';

/**
 * Administrative Creation: Allows Managers/Admins to manually provision any account type.
 */


const createUserIntoDB = async (payload: TUser): Promise<Omit<TUser, 'password'>> => {
  const userData: Partial<TUser> = { ...payload };

  // Fallback to systemic default credentials if no password was supplied
  if (!userData.password) {
    userData.password = config.default_password as string;
  }
  // Persist user record to database
  const newUser = await User.create(userData);
  // Strip password out of the return payload for runtime security compliance
  const result = newUser.toObject();
  delete result.password;

  return result;
};





const getSingelUserFromDB = async (id: string): Promise<Omit<TUser, 'password'> | null> => {
  const user = await User.findById(id).select('-password').lean();
  return user;
}




const deleteUserFromDB = async (id: string): Promise<Omit<TUser, 'password'> | null> => {
  // Soft delete by updating isDeleted flag
  const user = await User.findByIdAndUpdate(
    id, 
    { isDeleted: true }, 
    { new: true }
  ).select('-password'); // Strip the password for security

  if (!user) {
    throw new Error('User account not found');
  }

  return user;
};





const updateUserInDB = async (
  id: string,
  payload: Partial<TUser> & { oldPassword?: string; newPassword?: string },
): Promise<Omit<TUser, 'password'> | null> => {
  
  // 1. Fetch user document including the hidden password field
  const user = await User.findById(id).select('+password');
  if (!user) {
    throw new AppError(404, 'User account not found');
  }

  // 2. Handle Password Change Logic
  if (payload.oldPassword || payload.newPassword) {
    if (!payload.oldPassword || !payload.newPassword) {
      throw new AppError(400, 'Both oldPassword and newPassword are required to change password');
    }

    // Verify old password against the stored bcrypt hash using your static method
    const isPasswordMatched = await User.isPasswordMatched(
      payload.oldPassword,
      user.password!,
    );

    if (!isPasswordMatched) {
      throw new AppError(401, 'Current password does not match');
    }

    // Assign new password (the pre-save middleware will automatically bcrypt hash this string)
    user.password = payload.newPassword;
  }

  // 3. Dynamically apply regular fields if they exist in the payload
  if (payload.email) user.email = payload.email;
  if (payload.role) user.role = payload.role;
  if (payload.status) user.status = payload.status;
  if (payload.isDeleted !== undefined) user.isDeleted = payload.isDeleted;

  // 4. Save document (Triggers the bcrypt pre-save hashing hook securely)
  await user.save();

  // 5. Convert document to plain object and remove password for runtime security leakage
  const result = user.toObject();
  delete result.password;

  return result;
};    




const getAllUsersFromDB = async (): Promise<Omit<TUser, 'password'>[]> => {
  const users = await User.find({ isDeleted: false }).select('-password').lean();
  return users;
};




/**
 * Public Self-Registration: Safely registers a clean 'guest' account from the web signup form.
 */
const registerUserIntoDB = async (payload: Pick<TUser, 'email' | 'password'>): Promise<Omit<TUser, 'password'>> => {
  const userData: Partial<TUser> = {
    email: payload.email,
    password: payload.password,
    role: 'guest',    // Hardcoded sandbox role to block privilege escalation
    status: 'active', // Defaults explicitly to live access status
    isDeleted: false,
  };


  const newUser = await User.create(userData);

  const result = newUser.toObject();
  delete result.password;

  return result;
};

export const UserServices = {
  createUserIntoDB,
  registerUserIntoDB,
  getSingelUserFromDB,
  deleteUserFromDB,
  updateUserInDB,
  getAllUsersFromDB
};
