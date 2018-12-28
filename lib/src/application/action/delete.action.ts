import { Acl, BaseDeleteAction, IActionData } from '@power-cms/common/application';
import { DeleteUserCommandHandler } from '../command/delete-user.command-handler';

export class DeleteAction extends BaseDeleteAction {
  constructor(deleteUserHandler: DeleteUserCommandHandler, private acl: Acl) {
    super(deleteUserHandler);
  }

  public authorize(action: IActionData): Promise<boolean> {
    return this.acl
      .createBuilder(action)
      .isAdmin()
      .check();
  }
}
