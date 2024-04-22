import { config as conf } from "dotenv";

conf();
const _config = {
    port: process.env.PORT,
    mongoURL: process.env.Database_connection_string,
    env: process.env.NODE_ENV,
    jwtSecret: process.env.JWT_SECRET,
    cloudinaryName: process.env.Cloudinary_Name,
    cloudinarykey: process.env.Cloudinary_key,
    cloudinarySecret: process.env.Cloudinary_Secret,
    frontendDomain: process.env.Frontend_Domain
}
export const config = Object.freeze(_config)