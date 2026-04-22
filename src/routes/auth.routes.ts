import { Router } from "express";
import * as AuthController from '../controllers/auth.controller.js'
import { authenticate } from "../middlewares/authenticate.js";

const authRoutes = Router();

authRoutes.post('/signup', AuthController.signup);
authRoutes.post('/login', AuthController.login);
authRoutes.post('/refresh', AuthController.refresh);
authRoutes.post('/logout', authenticate, AuthController.refresh);

export default authRoutes;