import { IContainer } from '@power-cms/common/application';
import { validate } from '@power-cms/common/infrastructure';
import { Db } from 'mongodb';
import { createContainer } from '../../infrastructure/awilix.container';
import { UserView } from '../query/user.view';
import { CreateAction } from './create.action';
import { ValidationException } from '@power-cms/common/domain';

const properData = {
  username: 'User',
  email: 'test@test.com',
};

describe('Create action', () => {
  let container: IContainer;

  beforeAll(async () => {
    container = await createContainer();
  });

  beforeEach(async () => {
    (await container.resolve<Db>('db')).dropDatabase();
  });

  it('Creates user', async () => {
    const action = container.resolve<CreateAction>('userCreateAction');
    const { id, ...result }: UserView = await action.execute({ data: properData });

    expect(result).toEqual({ avatar: null, roles: [], ...properData });
    expect(id).toBeDefined();
  });

  it('Validates user', async () => {
    const action = container.resolve<CreateAction>('userCreateAction');

    expect.assertions(2);

    expect(() => {
      validate({}, action.validator);
    }).toThrowError(ValidationException);

    try {
      validate({}, action.validator);
    } catch (e) {
      const messageRequired = 'any.required';

      expect(e.details).toEqual([
        { path: 'username', message: messageRequired },
        { path: 'email', message: messageRequired },
      ]);
    }
  });

  it('Validates email format', async () => {
    const action = container.resolve<CreateAction>('userCreateAction');

    expect.assertions(1);

    try {
      validate({ username: 'TestUser', email: 'test' }, action.validator);
    } catch (e) {
      expect(e.details).toEqual([{ path: 'email', message: 'string.email' }]);
    }
  });

  it('Authorizes anauthenticated client', async () => {
    const action = container.resolve<CreateAction>('userCreateAction');

    const auth = await action.authorize();
    expect(auth).toBeTruthy();
  });
});
