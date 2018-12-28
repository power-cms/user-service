import { IContainer, IRemoteProcedure } from '@power-cms/common/application';
import { ValidationException, Id } from '@power-cms/common/domain';
import { validate } from '@power-cms/common/infrastructure';
import { Db } from 'mongodb';
import MongoMemoryServer from 'mongodb-memory-server';
import { createContainer } from '../../infrastructure/awilix.container';
import { UserView } from '../query/user.view';
import { CreateAction } from './create.action';
import { UpdateAction } from './update.action';

const RemoteProcedureMock = jest.fn<IRemoteProcedure>(() => ({
  call: jest.fn(),
}));

const properData = {
  username: 'User',
  email: 'test@test.com',
};

const updateData = {
  username: 'UserEdited',
  email: 'test-edited@test.com',
};

describe('Update action', () => {
  let container: IContainer;
  let mongo: MongoMemoryServer;
  let id: string;
  let remoteProcedure: IRemoteProcedure;

  beforeAll(async () => {
    mongo = new MongoMemoryServer();
    remoteProcedure = new RemoteProcedureMock();
    process.env.DB_HOST = 'localhost';
    process.env.DB_PORT = String(await mongo.getPort());
    process.env.DB_DATABASE = await mongo.getDbName();

    container = await createContainer(undefined, remoteProcedure);
  });

  beforeEach(async () => {
    (await container.resolve<Db>('db')).dropDatabase();
    const user = await container.resolve<CreateAction>('userCreateAction').handle({ data: properData });
    id = user.id;
  });

  it('Updates user', async () => {
    const action = container.resolve<UpdateAction>('userUpdateAction');
    const result: UserView = await action.handle({ data: updateData, params: { id: id.toString() } });

    expect(JSON.parse(JSON.stringify(result))).toEqual({
      ...properData,
      ...updateData,
      id: id.toString(),
      avatar: null,
      roles: [],
    });
  });

  it('Validates user', async () => {
    const action = container.resolve<UpdateAction>('userUpdateAction');

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

  it('Authorizes self user', async () => {
    const action = container.resolve<UpdateAction>('userUpdateAction');

    const auth = await action.authorize({ auth: { id: id.toString() }, data: { id: id.toString() } });
    expect(auth).toBeTruthy();
  });

  it('Calls authorize action if id not matching', async () => {
    const action = container.resolve<UpdateAction>('userUpdateAction');

    await action.authorize({ auth: { id: id.toString() }, data: { id: Id.generate().toString() } });
    expect(remoteProcedure.call).toBeCalled();
  });
});
