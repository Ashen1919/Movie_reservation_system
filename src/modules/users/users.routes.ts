import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import * as UserController from './users.controller.js';
import { authorize } from "../../middlewares/authorize.js";

const userRoutes = Router();

userRoutes.get('/me', authenticate, UserController.myProfile);
userRoutes.get('/', authenticate, authorize('ADMIN'), UserController.getAllUsers);

export default userRoutes;