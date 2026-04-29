import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import * as UserController from './users.controller.js';
import { authorize } from "../../middlewares/authorize.js";

const userRoutes = Router();

userRoutes.get('/me', authenticate, UserController.myProfile);
userRoutes.get('/', authenticate, authorize('ADMIN'), UserController.getAllUsers);
userRoutes.patch('/:id/block', authenticate, authorize('ADMIN'), UserController.blockUser);
userRoutes.patch('/:id/unblock', authenticate, authorize('ADMIN'), UserController.unblockUser);

export default userRoutes;