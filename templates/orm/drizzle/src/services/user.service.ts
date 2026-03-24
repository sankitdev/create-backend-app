import { users, type User } from "@/db/schema";
import { BaseService } from "@/services/base.service";

/**
 * This is the service class for User
 * It extends the BaseService class
 */
export class UserService extends BaseService<User> {
  // Passing table and model name to constructor of BaseService
  constructor() {
    super(users, "User");
  }
}
