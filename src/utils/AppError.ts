export class AppError extends Error {

    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppError);
        }
        Object.setPrototypeOf(this, AppError.prototype);
    }
};