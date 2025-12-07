import { IUser, User } from "@/models/user.model";
import { BaseService } from "@/services/base.service";

export class UserService extends BaseService<IUser> {
  constructor() {
    super(User);
  }

  public async findByEmail(email: string) {
    return this.model.findOne({ email });
  }
}
