/**
 * This is an example of a User model
 */
import mongoose, { Schema } from "mongoose";

/**
 * Creation of interface for User model
 * This helps in type checking and autocompletion
 * while working with schema and model
 * You can also import this interface in other files
 * for type checking and autocompletion
 */
export interface IUser {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Creation of schema for User model
 * Schema is the blueprint of the model
 * It defines the structure of the model
 */
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true }, // This will add createdAt and updatedAt fields
);

/**
 * Creation of model for User
 * Model is the class of the schema
 * It defines the structure of the document
 * This is the final model which create the collection in the database
 */
export const User = mongoose.model<IUser>("User", userSchema);
