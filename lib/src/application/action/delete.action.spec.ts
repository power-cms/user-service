import { IContainer, IRemoteProcedure } from '@power-cms/common/application';
import { Id } from '@power-cms/common/domain';
import { Db } from 'mongodb';
import MongoMemoryServer from 'mongodb-memory-server';
import { UserNotFoundException } from '../../domain/exception/user-not-found.exception';
import { createContainer } from '../../infrastructure/awilix.container';
import { DeleteAction } from './delete.action';
import { ReadAction } from './read.action';
import { CreateAction } from './create.action';

const RemoteProcedureMock = jest.fn<IRemoteProcedure>(() => ({
  call: jest.fn(),
}));

const properData = {
  username: 'User',
  email: 'test@test.com',
};

describe('Delete action', () => {
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

  it('Deletes single user', async () => {
    const action = container.resolve<DeleteAction>('userDeleteAction');
    await action.handle({ params: { id: id.toString() } });

    const readAction = container.resolve<ReadAction>('userReadAction');
    const handler = readAction.handle({ params: { id: Id.generate().toString() } });

    await expect(handler).rejects.toThrowError(UserNotFoundException);
  });

  it('Calls authorize action if id not matching', async () => {
    const action = container.resolve<DeleteAction>('userDeleteAction');

    await action.authorize({ auth: { id: id.toString() }, data: {} });
    expect(remoteProcedure.call).toBeCalled();
  });
});
