import { ActionType, IActionData, IActionHandler } from '@power-cms/common/application';
import { JoiObject } from 'joi';
import { IUserQuery } from '../query/user.query';
import { UserView } from '../query/user.view';
import { validator } from '../validator/login.validator';

export class GetByLoginAction implements IActionHandler {
  public name: string = 'getByLogin';
  public type: ActionType = ActionType.COLLECTION;
  public validator: JoiObject = validator;
  public private: boolean = true;

  constructor(private userQuery: IUserQuery) {}

  public handle(action: IActionData): Promise<UserView> {
    return this.userQuery.getByLogin(action.data.login);
  }
}
