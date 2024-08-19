import { Response, Request } from "express";
import { HttpError } from "http-errors";
import { config } from "../config/config";

const globalErrorHandler = (err: HttpError, req: Request, res: Response) => {
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({
        message: err.message,
        error: config.env === 'development' ? err.stack : ''
    }

    )

}
export default globalErrorHandler;

