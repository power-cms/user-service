import { BaseUpdateCommandHandler } from '@power-cms/common/application';
import { Id } from '@power-cms/common/domain';
import { User } from '../../domain/user';
import { IUserRepository } from '../../domain/user.repository';
import { IUpdateUserCommand } from './update-user.command';

export class UpdateUserCommandHandler extends BaseUpdateCommandHandler<User, IUpdateUserCommand> {
  constructor(userRepository: IUserRepository) {
    super(userRepository);
  }

  protected transform(command: IUpdateUserCommand): User {
    return new User(Id.fromString(command.id), command.username, command.email, command.avatar);
  }
}
