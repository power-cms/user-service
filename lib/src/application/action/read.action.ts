import { Acl, BaseReadAction, IActionData } from '@power-cms/common/application';
import { IUserQuery } from '../query/user.query';
import { UserView } from '../query/user.view';

export class ReadAction extends BaseReadAction<UserView> {
  constructor(userQuery: IUserQuery, private acl: Acl) {
    super(userQuery);
  }

  public authorize(action: IActionData): Promise<boolean> {
    return this.acl
      .createBuilder(action)
      .isAdmin()
      .custom((user: UserView) => action.auth && action.auth.id === user.id)
      .check();
  }
}
