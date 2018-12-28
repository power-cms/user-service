import { IContainer } from '@power-cms/common/application';
import { Id } from '@power-cms/common/domain';
import MongoMemoryServer from 'mongodb-memory-server';
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
  let mongo: MongoMemoryServer;

  beforeAll(async () => {
    mongo = new MongoMemoryServer();
    process.env.DB_HOST = 'localhost';
    process.env.DB_PORT = String(await mongo.getPort());
    process.env.DB_DATABASE = await mongo.getDbName();

    container = await createContainer();
  });

  beforeEach(async () => {
    (await container.resolve<Db>('db')).dropDatabase();
    await container.resolve<CreateUserCommandHandler>('createUserHandler').handle(properData);
  });

  it('Fetches user by username', async () => {
    const action = container.resolve<GetByLoginAction>('userGetByLoginAction');
    const result: UserView = await action.handle({ data: { login: properData.username } });
    expect(JSON.parse(JSON.stringify(result))).toEqual({ ...properData, id: id.toString(), avatar: null, roles: [] });
  });

  it('Fetches user by email', async () => {
    const action = container.resolve<GetByLoginAction>('userGetByLoginAction');
    const result: UserView = await action.handle({ data: { login: properData.email } });
    expect(JSON.parse(JSON.stringify(result))).toEqual({ ...properData, id: id.toString(), avatar: null, roles: [] });
  });

  it('Throws error then user not exists', async () => {
    const action = container.resolve<GetByLoginAction>('userGetByLoginAction');

    expect.assertions(1);

    try {
      await action.handle({ data: { name: 'test', data: { login: 'NotExisting' } } });
    } catch (e) {
      expect(e instanceof UserNotFoundException).toBeTruthy();
    }
  });
});
