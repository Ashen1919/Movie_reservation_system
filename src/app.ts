import cookieParser from "cookie-parser";
import express from "express";
import cors from 'cors';

// create express app
const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

// health check method
app.get("/health", (req, res) => {
    res.status(200).json({
        status: 'Ok'
    });
});

// config cors
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: [ 'GET','POST','PUT','DELETE','PATCH','OPTIONS' ]
}));

export default app;