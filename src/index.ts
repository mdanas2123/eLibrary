import app from "./app";
import { config } from "./config/config";
import connectDB from "./config/db";

const StartServer = async () => {
    await connectDB();
    const port = config.port || 3000;

    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    });
};
StartServer();

export default app;
