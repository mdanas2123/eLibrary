import { Response, Request, NextFunction } from "express";
import { HttpError } from "http-errors";
import { config } from "../config/config";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({
        message: err.message,
        error: config.env === 'development' ? err.stack : ''
    }

    )

}
export default globalErrorHandler;

