import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod/v3";

// target type declare
type Target = 'body' | 'query' | 'params';

export const validate = (Schema: ZodSchema, target: Target = 'body') => 
    (req: Request, res: Response, next: NextFunction) => {
    // validate the request data using the provided Zod schema
    const result = Schema.safeParse(req[target]);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            errors: result.error.flatten().fieldErrors,
        });
    };

    req[target] = result.data;
    next();
};