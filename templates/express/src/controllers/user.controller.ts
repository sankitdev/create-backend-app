import { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { userService } from "@/services";

export const getUserByEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.query;
  const users = await userService.findByEmail(email as string);
  return res.status(200).json({
    message: "User fetched Successfully",
    data: users,
  });
});
