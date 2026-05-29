import { z } from 'zod';

const createGuestValidationSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: 'User ID reference is required!',
    }),
    name: z.string({
      required_error: 'Name is required!',
    }),
    phone: z.string({
      required_error: 'Phone number is required!',
    }),
    passportNumber: z.string({
      required_error: 'Passport number is required!',
    }),
  }),
});

const updateGuestValidationSchema = z.object({
  body: z.object({
    userId: z.string().optional(),
    name: z.string().optional(),
    phone: z.string().optional(),
    passportNumber: z.string().optional(),
  }),
});

export const GuestValidation = {
  createGuestValidationSchema,
  updateGuestValidationSchema,
};
