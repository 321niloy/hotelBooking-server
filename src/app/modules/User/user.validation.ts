import { z } from 'zod';
import { UserStatus } from './user.constant';

const createUserValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        invalid_type_error: 'Email must be a string',
        required_error: 'Email is required',
      })
      .email({ message: 'Invalid email address format' }),
    password: z
      .string({
        invalid_type_error: 'Password must be a string',
        required_error: 'Password is required',
      })
      .min(6, { message: 'Password must be at least 6 characters long' })
      .max(20, { message: 'Password cannot be more than 20 characters' }),
    role: z
      .enum(['guest', 'manager', 'admin'] as [string, ...string[]])
      .default('guest'), // Automatically injects 'guest' if not provided
    status: z
      .enum([...UserStatus] as [string, ...string[]])
      .optional(),
  }),
});

const updateUserValidationSchema = z
  .object({
    body: z.object({
      email: z
        .string({ invalid_type_error: 'Email must be a string' })
        .email({ message: 'Invalid email address format' })
        .optional(),
      role: z
        .enum(['guest', 'manager', 'admin'] as [string, ...string[]])
        .optional(),
      status: z
        .enum([...UserStatus] as [string, ...string[]])
        .optional(),
      isDeleted: z
        .boolean({ invalid_type_error: 'isDeleted must be a boolean' })
        .optional(),
      oldPassword: z
        .string({ invalid_type_error: 'Old password must be a string' })
        .min(6, { message: 'Old password must be at least 6 characters long' })
        .optional(),
      newPassword: z
        .string({ invalid_type_error: 'New password must be a string' })
        .min(6, { message: 'New password must be at least 6 characters long' })
        .max(20, { message: 'New password cannot be more than 20 characters' })
        .optional(),
    }),
  })
  .refine(
    (data) => {
      const { oldPassword, newPassword } = data.body;
      // If one password field is present, the other must be too
      return (oldPassword && newPassword) || (!oldPassword && !newPassword);
    },
    {
      message: 'Both oldPassword and newPassword are required to change your password',
      path: ['body', 'newPassword'], // Highlights the field in the error response
    },
  );

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...UserStatus] as [string, ...string[]], {
      required_error: 'Status is required',
    }),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
  changeStatusValidationSchema,
};
