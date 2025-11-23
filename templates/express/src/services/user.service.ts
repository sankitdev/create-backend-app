import { IUser, User } from "../models/User.model";
import { BaseService } from "./base.service";

export class UserService extends BaseService<IUser> {
  constructor() {
    super(User);
  }

  public async findByEmail(email: string) {
    return this.model.findOne({ email });
  }
}
