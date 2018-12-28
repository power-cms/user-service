import { BaseDeleteCommandHandler } from '@power-cms/common/application';
import { IUserRepository } from '../../domain/user.repository';
import { IDeleteUserCommand } from './delete-user.command';

export class DeleteUserCommandHandler extends BaseDeleteCommandHandler<IDeleteUserCommand> {
  constructor(private userRepository: IUserRepository) {
    super(userRepository);
  }

  protected getId(command: IDeleteUserCommand): string {
    return command.id;
  }
}
