import express from "express";

const app = express();

app.get("/", (req, res, next) => {
    res.json({ massage: "welcome to my eLibrary" })
})

export default app;
