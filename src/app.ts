// import express from "express";
// import globalErrorHandler from "./Middleware/globalErrorHandler";
// import userRouter from "./user/userRouter";
// import bookRouter from "./books/bookRouter";
// import cors from "cors";
// import { config } from "./config/config";



// const app = express();
// app.use(express.json());
// console.log("frontend domain is : ", config.frontendDomain)
// app.use(
//     cors({
//         origin: config.frontendDomain,
//         credentials: true,
//     })
// )


// app.get("/", (req, res) => {
//     res.json({ massage: "welcome to my eLibrary" })
// })
// app.use("/api/users", userRouter)

// app.use("/api/books", bookRouter)

// app.use(globalErrorHandler)

// export default app;

import express from "express";
import globalErrorHandler from "./Middleware/globalErrorHandler";
import userRouter from "./user/userRouter";
import bookRouter from "./books/bookRouter";
import cors from "cors";
import { config } from "./config/config";

const app = express();
app.use(express.json());

// Log the frontend domain for debugging purposes
console.log("Frontend domain is:", config.frontendDomain);

// CORS configuration
app.use(
    cors({
        origin: function (origin, callback) {
            // Allow the specific frontend domain
            if (origin === config.frontendDomain || !origin) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        credentials: true,
        allowedHeaders: "Content-Type,Authorization",
    })
);

// Handle preflight requests for all routes
app.options("*", cors());

// Define routes
app.get("/", (req, res) => {
    res.json({ message: "Welcome to my eLibrary" });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

// Global error handler
app.use(globalErrorHandler);

export default app;
