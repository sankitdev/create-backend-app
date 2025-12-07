import { z } from "zod";

export const getUserByEmailSchema = z.object({
  body: z.object({
    email: z.email({
      error: (issue) => (issue.input === undefined ? "Email is required" : "Invalid email format"),
    }),
  }),
});
