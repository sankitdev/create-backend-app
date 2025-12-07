import e from "express";
import { getUserByEmail } from "@/controllers/user.controller";
import { validate } from "@/middleware/validate";
import { getUserByEmailSchema } from "@/validation";

export const userRouter = e.Router();

userRouter.get("/", validate({query: getUserByEmailSchema}), getUserByEmail);
