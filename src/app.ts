import express from "express";
import createHttpError from "http-errors";
import globalErrorHandler from "./Middleware/globalErrorHandler";

const app = express();

app.get("/", (req, res, next) => {
    const error = createHttpError(400, "something bad happened");
    throw error;
    res.json({ massage: "welcome to my eLibrary" })

})
app.use(globalErrorHandler)
export default app;
