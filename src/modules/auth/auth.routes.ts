import { Router } from "express";
import * as AuthController from './auth.controller.js'
import { authenticate } from "../../middlewares/authenticate.js";
import { validate } from "../../utils/validate.js";
import { loginSchema, signUpSchema } from "./auth.schema.js";
import { authLimiter } from "../../middlewares/rateLimiter.js";

const authRoutes = Router();

authRoutes.post('/signup', authLimiter ,validate(signUpSchema), AuthController.signup);
authRoutes.post('/login', authLimiter, validate(loginSchema), AuthController.login);
authRoutes.post('/refresh', AuthController.refresh);
authRoutes.post('/logout', authenticate, AuthController.logout);
authRoutes.post('/verify-email', AuthController.verifyEmail);
authRoutes.post('/resend-verification', AuthController.resendVerificationEmail);

export default authRoutes;