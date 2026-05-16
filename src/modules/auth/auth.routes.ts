import { Router } from "express";
import * as AuthController from './auth.controller.js'
import { authenticate } from "../../middlewares/authenticate.js";
import { authLimiter } from "../../middlewares/rateLimiter.js";

const authRoutes = Router();

authRoutes.post('/signup', authLimiter , AuthController.signup);
authRoutes.post('/login', authLimiter, AuthController.login);
authRoutes.post('/refresh', AuthController.refresh);
authRoutes.post('/logout', authenticate, AuthController.logout);
authRoutes.post('/verify-email', AuthController.verifyEmail);
authRoutes.post('/resend-verification', AuthController.resendVerificationEmail);

export default authRoutes;