import { v2 as cloudinary } from 'cloudinary';
import { config } from './config';

cloudinary.config({
    cloud_name: config.cloudinaryName,
    api_key: config.cloudinarykey,
    api_secret: config.cloudinarySecret
});
export default cloudinary;