import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "@/constants/http";

type SchemaMap = {
  params?: ZodType;
  query?: ZodType;
  headers?: ZodType;
  body?: ZodType;
};

/**
 * Validate incoming request data for body, params, query, headers
 *
 * @param schemas - Object containing schemas for body, params, query, headers
 * @returns Error if validation fails, otherwise calls next()
 */
export const validate =
  (schemas: SchemaMap) => (req: Request, res: Response, next: NextFunction) => {
    const order: (keyof SchemaMap)[] = ["params", "query", "headers", "body"];

    for (const key of order) {
      const schema = schemas[key];
      if (!schema) continue;

      const parsed = schema.safeParse(req[key]);
      if (!parsed.success) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          errorIn: key, // tells frontend which part failed
          errors: parsed.error.issues,
        });
      }

      req[key] = parsed.data; // assign validated + typed value
    }

    return next();
  };
