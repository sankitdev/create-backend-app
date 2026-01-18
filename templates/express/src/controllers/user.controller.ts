import { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { userService } from "@/services";
import { HTTP_STATUS } from "@/constants/http";
import { MESSAGES } from "@/constants/messages";

/**
 * Controller for getting user by email
 * This controller is for getting user by email
 * It is used in user.routes.ts
 */
export const getUserByEmail = asyncHandler(async (req: Request, res: Response) => {
  // Destructuring email from query
  const { email } = req.query;

  // Fetching user by email
  const users = await userService.findAll({ email });

  // Returning response
  return res.status(HTTP_STATUS.OK).json({
    message: MESSAGES.USER_FETCHED_SUCCESSFULLY,
    data: users,
  });
});
