import cookieParser from "cookie-parser";
import express from "express";
import cors from 'cors';
import authRoutes from "./modules/auth/auth.routes.js";
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from "./config/swagger.js";
import userRoutes from "./modules/users/users.routes.js";
import genreRoute from "./modules/genres/genre.routes.js";
import movieRoutes from "./modules/movies/movie.routes.js";
import showtimeRoutes from "./modules/showtimes/showtimes.routes.js";
import { handleStripeWebhook } from "./modules/payments/payment.webhook.js";

// create express app
const app = express();

// webhook route
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook );

// config cors
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: [ 'GET','POST','PUT','DELETE','PATCH','OPTIONS' ]
}));

// middlewares
app.use(express.json());
app.use(cookieParser());

// health check method
app.get("/health", (req, res) => {
    res.status(200).json({
        status: 'Ok'
    });
});

// swagger docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: { persistAuthorization: true }
}));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/genres', genreRoute);
app.use('/api/movies', movieRoutes);
app.use('/api/showtimes', showtimeRoutes);

export default app;