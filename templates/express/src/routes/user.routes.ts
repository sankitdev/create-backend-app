import e from "express";
import { getUserByEmail } from "../controllers/user.controller";
import { validateBody } from "../middleware/validate";
import { getUserByEmailSchema } from "../validation";

export const userRouter = e.Router();

userRouter.get("/", validateBody(getUserByEmailSchema), getUserByEmail);
