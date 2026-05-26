/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';


// import { USER_ROLE } from './user.constant';

import { UserValidation } from './user.validation';
import validateRequest from '../../middlewares/validateRequest';
import { UserControllers } from './user.controller';

const router = express.Router();

// Create a new user (Accessible by admin and manager, or open if it is a registration endpoint)
router.post(
  '/create-user',
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.createUser,
 
);

// // Get a single user by ID
router.get(
  '/:id',
  UserControllers.getSingelUser
);

// // Update user details by ID
router.patch(
  '/:id',
  UserControllers.updateUser
);

// Delete a user (Soft delete) by ID
router.delete(
  '/:id',
  UserControllers.deleteUser,
);

router.get( "/" , UserControllers.getAllUsers);



export const UserRoutes = router;

