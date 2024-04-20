import { NextFunction, Request, Response } from "express";

const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.json({ messsage: "user registerd successfully" })
}
export default createUser;