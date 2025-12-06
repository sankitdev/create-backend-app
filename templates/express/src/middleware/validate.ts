import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";

type SchemaMap = {
  params?: ZodType;
  query?: ZodType;
  headers?: ZodType;
  body?: ZodType;
};

export const validate =
  (schemas: SchemaMap) =>
  (req: Request, res: Response, next: NextFunction) => {
    const order: (keyof SchemaMap)[] = ["params", "query", "headers", "body"];

    for (const key of order) {
      const schema = schemas[key];
      if (!schema) continue;

      const parsed = schema.safeParse(req[key]);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          errorIn: key, // tells frontend which part failed
          errors: parsed.error.issues,
        });
      }

      req[key] = parsed.data; // assign validated + typed value
    }

    return next();
  };
