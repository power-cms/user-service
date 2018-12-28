import { ActionType, IActionData, IActionHandler } from '@power-cms/common/application';
import { Id } from '@power-cms/common/domain';
import { JoiObject } from 'joi';
import { GrantRolesCommandHandler } from '../command/grant-roles.command-handler';
import { IUserQuery } from '../query/user.query';
import { UserView } from '../query/user.view';
import { validator } from '../validator/grant-role.validator';

export class GrantRolesAction implements IActionHandler {
  public name: string = 'grantRoles';
  public type: ActionType = ActionType.UPDATE;
  public validator: JoiObject = validator;
  public private: boolean = true;

  constructor(private userQuery: IUserQuery, private grantRolesHandler: GrantRolesCommandHandler) {}

  public async handle(action: IActionData): Promise<UserView> {
    const id: string = action.params.id;
    const roles: string[] = action.data.roles;

    await this.grantRolesHandler.handle({ id, roles });

    return this.userQuery.get(Id.fromString(id));
  }

  public async authorize(): Promise<boolean> {
    return true;
  }
}
