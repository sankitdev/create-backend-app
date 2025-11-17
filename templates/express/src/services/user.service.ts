import { IUser, User } from "../models/User.model";
import { logger } from "../utils/logger";
import { BaseService } from "./base.service";

export class UserService extends BaseService<IUser> {
  constructor() {
    super(User);
  }

  public async findByEmail(email: string) {
    try {
      const user = this.model.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      logger.error({ error, email }, "Error fetching user by email");
      throw error;
    }
  }
}
