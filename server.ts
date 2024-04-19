import app from "./src/app";

const StartServer = () => {
    const port = process.env.PORT || 3000;

    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    });
};
StartServer();
