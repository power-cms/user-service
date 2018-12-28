import { BaseCreateCommandHandler } from '@power-cms/common/application';
import { Id } from '@power-cms/common/domain';
import { User } from '../../domain/user';
import { IUserRepository } from '../../domain/user.repository';
import { ICreateUserCommand } from './create-user.command';

export class CreateUserCommandHandler extends BaseCreateCommandHandler<User, ICreateUserCommand> {
  constructor(userRepository: IUserRepository) {
    super(userRepository);
  }

  protected transform(command: ICreateUserCommand): User {
    return new User(Id.fromString(command.id), command.username, command.email, command.avatar);
  }
}
