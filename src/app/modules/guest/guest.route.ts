import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { GuestValidation } from './guest.validation';
import { GuestControllers } from './guest.controller';

const router = express.Router();

router.post(
  '/create-guest',
  validateRequest(GuestValidation.createGuestValidationSchema),
  GuestControllers.createGuest,
);

router.patch(
  '/:id',
  validateRequest(GuestValidation.updateGuestValidationSchema),
  GuestControllers.updateGuest,
);

export const GuestRoutes = router;
