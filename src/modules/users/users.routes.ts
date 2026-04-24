import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import * as UserController from './users.controller.js';

const userRoutes = Router();

userRoutes.get('/me', authenticate, UserController.myProfile);

export default userRoutes;