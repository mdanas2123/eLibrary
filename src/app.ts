import express from "express";
import globalErrorHandler from "./Middleware/globalErrorHandler";
import userRouter from "./user/userRouter";
import bookRouter from "./books/bookRouter";


const app = express();
app.use(express.json());

app.get("/", (req, res, next) => {
    res.json({ massage: "welcome to my eLibrary" })
})
app.use("/api/users", userRouter)
app.use("/api/books", bookRouter)

app.use(globalErrorHandler)

export default app;

