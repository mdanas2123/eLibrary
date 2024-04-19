import app from "./src/app";
import { config } from "./src/config/config";

const StartServer = () => {
    const port = config.port || 3000;

    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    });
};
StartServer();
