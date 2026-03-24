import { User } from "@prisma/client";
import { BaseService } from "@/services/base.service";

/**
 * This is the service class for User
 * It extends the BaseService class
 */
export class UserService extends BaseService<User> {
  // Passing model name to constructor of BaseService
  constructor() {
    super("user");
  }
}
