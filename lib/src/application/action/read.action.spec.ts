import { IContainer, IRemoteProcedure } from '@power-cms/common/application';
import { Id } from '@power-cms/common/domain';
import { Db } from 'mongodb';
import MongoMemoryServer from 'mongodb-memory-server';
import { UserNotFoundException } from '../../domain/exception/user-not-found.exception';
import { createContainer } from '../../infrastructure/awilix.container';
import { UserView } from '../query/user.view';
import { ReadAction } from './read.action';
import { CreateAction } from './create.action';

const RemoteProcedureMock = jest.fn<IRemoteProcedure>(() => ({
  call: jest.fn(),
}));

const properData = {
  username: 'User',
  email: 'test@test.com',
};

describe('Read action', () => {
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

  it('Fetches single user', async () => {
    const action = container.resolve<ReadAction>('userReadAction');
    const result: UserView = await action.handle({ params: { id } });
    expect(JSON.parse(JSON.stringify(result))).toEqual({ ...properData, id, avatar: null, roles: [] });
  });

  it('Throws error then user not exists', async () => {
    const action = container.resolve<ReadAction>('userReadAction');

    const handler = action.handle({ params: { id: Id.generate().toString() } });
    await expect(handler).rejects.toThrowError(UserNotFoundException);
  });

  it('Calls authorize action if id not matching', async () => {
    const action = container.resolve<ReadAction>('userReadAction');

    await action.authorize({ auth: { id: id.toString() }, data: { id: Id.generate().toString() } });
    expect(remoteProcedure.call).toBeCalled();
  });
});
