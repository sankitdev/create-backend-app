export type ORM = "mongoose" | "prisma" | "drizzle";

export type ProjectConfig = {
  projectName: string;
  orm: ORM;
};
