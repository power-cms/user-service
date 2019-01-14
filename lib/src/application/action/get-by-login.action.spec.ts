import { IContainer } from '@power-cms/common/application';
import { Id } from '@power-cms/common/domain';
import { Db } from 'mongodb';
import { UserNotFoundException } from '../../domain/exception/user-not-found.exception';
import { createContainer } from '../../infrastructure/awilix.container';
import { CreateUserCommandHandler } from '../command/create-user.command-handler';
import { UserView } from '../query/user.view';
import { GetByLoginAction } from './get-by-login.action';

const id = Id.generate();

const properData = {
  id: id.toString(),
  username: 'User',
  email: 'test@test.com',
};

describe('Get by login action', () => {
  let container: IContainer;

  beforeAll(async () => {
    container = await createContainer();
  });

  beforeEach(async () => {
    (await container.resolve<Db>('db')).dropDatabase();
    await container.resolve<CreateUserCommandHandler>('createUserHandler').handle(properData);
  });

  it('Fetches user by username', async () => {
    const action = container.resolve<GetByLoginAction>('userGetByLoginAction');
    const result: UserView = await action.execute({ data: { login: properData.username } });
    expect(JSON.parse(JSON.stringify(result))).toEqual({ ...properData, id: id.toString(), avatar: null, roles: [] });
  });

  it('Fetches user by email', async () => {
    const action = container.resolve<GetByLoginAction>('userGetByLoginAction');
    const result: UserView = await action.execute({ data: { login: properData.email } });
    expect(JSON.parse(JSON.stringify(result))).toEqual({ ...properData, id: id.toString(), avatar: null, roles: [] });
  });

  it('Throws error then user not exists', async () => {
    const action = container.resolve<GetByLoginAction>('userGetByLoginAction');
    const handler = action.execute({ data: { login: 'NotExisting' } });

    expect.assertions(1);

    await expect(handler).rejects.toThrowError(UserNotFoundException);
  });
});
