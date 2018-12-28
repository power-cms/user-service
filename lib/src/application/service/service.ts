import { IActionHandler, IService } from '@power-cms/common/application';

export class UserService implements IService {
  public name: string = 'user';

  constructor(public actions: IActionHandler[]) {}
}
