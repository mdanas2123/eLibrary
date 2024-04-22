import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { config } from "../config/config";
import { verify } from "jsonwebtoken";

export interface AuthRequest extends Request {
    userId: string;
}
const authenticate = (req: Request, res: Response, next: NextFunction) => {

    const token = req.header("authorization");
    if (!token) {
        const error = createHttpError(401, "No token provided");
        return next(error);
    }
    try {
        const parsedToken = token.split(' ')[1];
        const decoded = verify(parsedToken, config.jwtSecret as string);


        const _req = req as AuthRequest;
        _req.userId = decoded.sub as string;
        next();
    } catch (error) {
        return next(createHttpError(401, "token han been expire"));

    }
}

export default authenticate;