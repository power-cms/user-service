import { IContainer } from '@power-cms/common/application';
import { Db } from 'mongodb';
import MongoMemoryServer from 'mongodb-memory-server';
import { createContainer } from '../../infrastructure/awilix.container';
import { UserView } from '../query/user.view';
import { CreateAction } from './create.action';
import { GrantRolesAction } from './grant-roles.action';

const properData = {
  username: 'User',
  email: 'test@test.com',
};

const rolesData = {
  roles: ['Admin'],
};

describe('Grant roles action', () => {
  let container: IContainer;
  let mongo: MongoMemoryServer;
  let id: string;

  beforeAll(async () => {
    mongo = new MongoMemoryServer();
    process.env.DB_HOST = 'localhost';
    process.env.DB_PORT = String(await mongo.getPort());
    process.env.DB_DATABASE = await mongo.getDbName();

    container = await createContainer();
  });

  beforeEach(async () => {
    (await container.resolve<Db>('db')).dropDatabase();
    const user = await container.resolve<CreateAction>('userCreateAction').handle({ data: properData });
    id = user.id;
  });

  it('Grants user admin role', async () => {
    const action = container.resolve<GrantRolesAction>('userGrantRolesAction');
    const result: UserView = await action.handle({ data: rolesData, params: { id: id.toString() } });

    expect(JSON.parse(JSON.stringify(result))).toEqual({
      ...properData,
      ...rolesData,
      id: id.toString(),
      avatar: null,
    });
  });

  it('Authorizes anauthenticated client', async () => {
    const action = container.resolve<GrantRolesAction>('userGrantRolesAction');

    const auth = await action.authorize();
    expect(auth).toBeTruthy();
  });
});
