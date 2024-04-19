import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {

  try {

    mongoose.connection.on('connected', () => {
      console.log('connected to database successfully');
    })

    mongoose.connection.on('error', (err) => {
      return console.log('error in database connection', err)
    })

    await mongoose.connect(config.mongoURL as string);

  } catch (error) {
    console.log('database connection faild  ' + error)
    process.exit(1)
  }

}
export default connectDB;