import { ICommandHandler } from '@power-cms/common/application';
import { Id } from '@power-cms/common/domain';
import { IUserRepository } from '../../domain/user.repository';
import { IGrantRolesCommand } from './grant-roles.command';

export class GrantRolesCommandHandler implements ICommandHandler {
  constructor(private userRepository: IUserRepository) {}

  public async handle(command: IGrantRolesCommand): Promise<void> {
    await this.userRepository.grantRoles(Id.fromString(command.id), command.roles);
  }
}
