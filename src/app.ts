import cookieParser from "cookie-parser";
import express from "express";
import cors from 'cors';
import authRoutes from "./modules/auth/auth.routes.js";
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from "./config/swagger.js";
import userRoutes from "./modules/users/users.routes.js";

// create express app
const app = express();

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

export default app;