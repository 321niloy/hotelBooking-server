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

const updateUserValidationSchema = z.object({
  body: z
    .object({
      email: z.string().email().optional(),
      role: z.enum(['guest', 'manager', 'admin'] as [string, ...string[]]).optional(),
      status: z.enum([...UserStatus] as [string, ...string[]]).optional(),
      isDeleted: z.boolean().optional(),
      oldPassword: z.string().min(6).optional(),
      newPassword: z.string().min(6).max(20).optional(),
    })
    .refine(
      (bodyData) => {
        const { oldPassword, newPassword } = bodyData;
        return (oldPassword && newPassword) || (!oldPassword && !newPassword);
      },
      {
        message: 'Both oldPassword and newPassword are required to change your password',
        path: ['newPassword'], // Path is now relative to 'body'
      }
    ),
});


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
