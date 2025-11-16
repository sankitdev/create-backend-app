import mongoose from "mongoose";
import { config } from "./config";

export const connectDb = async () => {
  try {
    await mongoose.connect(config.mongoURI);
    console.log("Connected to Mongo DB");
  } catch (error) {
    console.log("Error while connecting:", error);
    process.exit();
  }
};
