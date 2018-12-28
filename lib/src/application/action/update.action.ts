import { Acl, BaseUpdateAction, IActionData } from '@power-cms/common/application';
import { JoiObject } from 'joi';
import { UpdateUserCommandHandler } from '../command/update-user.command-handler';
import { IUserQuery } from '../query/user.query';
import { UserView } from '../query/user.view';
import { validator } from '../validator/update.validator';

export class UpdateAction extends BaseUpdateAction<UserView> {
  public validator: JoiObject = validator;

  constructor(updateUserHandler: UpdateUserCommandHandler, userQuery: IUserQuery, private acl: Acl) {
    super(updateUserHandler, userQuery);
  }

  public authorize(action: IActionData): Promise<boolean> {
    return this.acl
      .createBuilder(action)
      .isAdmin()
      .custom((user: UserView) => action.auth && action.auth.id === user.id)
      .check();
  }
}
