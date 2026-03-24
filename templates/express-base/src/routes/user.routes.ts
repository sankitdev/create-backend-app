import e from "express";
import { getUserByEmail } from "@/controllers/user.controller";
import { validate } from "@/middleware/validate";
import { getUserByEmailSchema } from "@/validation";

/**
 * Creation of router for User
 * Router is the collection of routes
 * It defines the structure of the routes
 */
export const userRouter = e.Router();

/**
 * Creation of route for User
 * Route is the endpoint of the API
 * It defines the structure of the API
 * This route is for getting user by email
 */
userRouter.get("/", validate({ query: getUserByEmailSchema }), getUserByEmail);
