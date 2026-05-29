import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.routes';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { GuestRoutes } from '../modules/guest/guest.route';



const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/guests',
    route: GuestRoutes,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
