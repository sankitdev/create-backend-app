import type { Request, Response, NextFunction } from "express";
import { RequestHandler } from "express-serve-static-core";

/**
 * This function is used to handle async errors
 * instead of writing try catch each time we pass function
 * directly here and it will catch any error that occurs
 * @param fn The function to handle
 * @returns The function to handle
 */

export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
