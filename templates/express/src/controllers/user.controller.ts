import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { userService } from "../services";
import { MESSAGES } from "../constants/messages";

export const getUserByEmail = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const users = await userService.findByEmail(email);
    return res.status(200).json({
      message: MESSAGES.USER_FETCHED_SUCCESSFULLY,
      data: users,
    });
  }
);
