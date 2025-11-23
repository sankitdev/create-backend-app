import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";

// Generic middleware – schema must be a Zod schema (ZodType)
export const validateBody =
  <Schema extends ZodType<any, any>>(schema: Schema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: parsed.error.issues,
      });
    }

    req.body = parsed.data; // typed as inferred output
    return next();
  };
