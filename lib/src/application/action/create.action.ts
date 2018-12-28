import { BaseCreateAction } from '@power-cms/common/application';
import { JoiObject } from 'joi';
import { CreateUserCommandHandler } from '../command/create-user.command-handler';
import { IUserQuery } from '../query/user.query';
import { UserView } from '../query/user.view';
import { validator } from '../validator/create.validator';

export class CreateAction extends BaseCreateAction<UserView> {
  public validator: JoiObject = validator;

  constructor(createUserHandler: CreateUserCommandHandler, userQuery: IUserQuery) {
    super(createUserHandler, userQuery);
  }

  public async authorize(): Promise<boolean> {
    return true;
  }
}
