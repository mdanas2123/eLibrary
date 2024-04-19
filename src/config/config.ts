import { config as conf } from "dotenv";

conf();
const _config = {
    port: process.env.PORT,
    mongoURL: process.env.Database_connection_string,
    env: process.env.NODE_ENV
}
export const config = Object.freeze(_config)