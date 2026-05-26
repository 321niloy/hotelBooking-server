/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';


import { USER_ROLE } from './user.constant';

import { UserValidation } from './user.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

// Create a new user (Accessible by admin and manager, or open if it is a registration endpoint)
router.post(
  '/create-user',
  validateRequest(UserValidation.createUserValidationSchema),
 
);

// Get a single user by ID
router.get(
  '/:id',
);

// Update user details by ID
router.patch(
  '/:id',
  validateRequest(UserValidation.updateUserValidationSchema),
);

// Delete a user (Soft delete) by ID
router.delete(
  '/:id',
);

// Change user status (active/blocked) by ID
router.post(
  '/change-status/:id',
  validateRequest(UserValidation.changeStatusValidationSchema),
);

// Get currently logged-in user profile
router.get(
  '/me',
);

export const UserRoutes = router;

