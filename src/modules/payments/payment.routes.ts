import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { handlePaymentIntent } from "./payment.controller.js";

const paymentRoute = Router();

paymentRoute.post('/create-intent', authenticate, handlePaymentIntent);

export default paymentRoute;