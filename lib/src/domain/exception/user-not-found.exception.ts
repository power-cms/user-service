import { Id, NotFoundException } from '@power-cms/common/domain';

export class UserNotFoundException extends NotFoundException {
  public static withId(id: Id): UserNotFoundException {
    return new UserNotFoundException(`User with id ${id.toString()} cannot be found.`);
  }

  public static withLogin(login: string): UserNotFoundException {
    return new UserNotFoundException(`User with login ${login} cannot be found.`);
  }
}
