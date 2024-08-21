import express from "express";
import globalErrorHandler from "./Middleware/globalErrorHandler";
// import userRouter from "./user/userRouter";
// import bookRouter from "./books/bookRouter";
import cors from "cors";
import { config } from "./config/config";



const app = express();
app.use(express.json());
console.log("frontend domain is : ", config.frontendDomain)
app.use(
    cors({
        origin: config.frontendDomain,
        credentials: true,
    })
)


app.get("/", (req, res) => {
    res.json({ massage: "welcome to my eLibrary" })
})
// app.use("/api/users", userRouter)

// app.use("/api/books", bookRouter)

app.use(globalErrorHandler)

export default app;

