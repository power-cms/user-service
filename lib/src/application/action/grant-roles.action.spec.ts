import { IContainer } from '@power-cms/common/application';
import { Db } from 'mongodb';
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
  let id: string;

  beforeAll(async () => {
    container = await createContainer();
  });

  beforeEach(async () => {
    (await container.resolve<Db>('db')).dropDatabase();
    const user = await container.resolve<CreateAction>('userCreateAction').execute({ data: properData });
    id = user.id;
  });

  it('Grants user admin role', async () => {
    const action = container.resolve<GrantRolesAction>('userGrantRolesAction');
    const result: UserView = await action.execute({ data: rolesData, params: { id } });

    expect(JSON.parse(JSON.stringify(result))).toEqual({
      ...properData,
      ...rolesData,
      id,
      avatar: null,
    });
  });

  it('Authorizes anauthenticated client', async () => {
    const action = container.resolve<GrantRolesAction>('userGrantRolesAction');

    const auth = await action.authorize();
    expect(auth).toBeTruthy();
  });
});
