import { IUser, User } from "@/models/user.model";
import { BaseService } from "@/services/base.service";

/**
 * This is the service class for User
 * It extends the BaseService class
 */
export class UserService extends BaseService<IUser> {
  // Passing model to constructor of BaseService
  constructor() {
    super(User);
  }
}
