import express from "express";
import createHttpError from "http-errors";
import globalErrorHandler from "./Middleware/globalErrorHandler";
import userRouter from "./user/userRouter";


const app = express();

app.get("/", (req, res, next) => {
    res.json({ massage: "welcome to my eLibrary" })
})
app.use("/api/users", userRouter)

app.use(globalErrorHandler)

export default app;
