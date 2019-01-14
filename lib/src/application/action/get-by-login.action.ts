import { ActionType, BaseAction, IActionData } from '@power-cms/common/application';
import { JoiObject } from 'joi';
import { IUserQuery } from '../query/user.query';
import { UserView } from '../query/user.view';
import { validator } from '../validator/login.validator';

export class GetByLoginAction extends BaseAction {
  public name: string = 'getByLogin';
  public type: ActionType = ActionType.COLLECTION;
  public validator: JoiObject = validator;
  public private: boolean = true;

  constructor(private userQuery: IUserQuery) {
    super();
  }

  public perform(action: IActionData): Promise<UserView> {
    return this.userQuery.getByLogin(action.data.login);
  }
}
