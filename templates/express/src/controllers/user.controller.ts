import { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { userService } from "@/services";
import { HTTP_STATUS } from "@/constants/http";
import { MESSAGES } from "@/constants/messages";

export const getUserByEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.query;
  const users = await userService.findByEmail(email as string);
  return res.status(HTTP_STATUS.OK).json({
    message: MESSAGES.USER_FETCHED_SUCCESSFULLY,
    data: users,
  });
});
