import { IContainer, IRemoteProcedure } from '@power-cms/common/application';
import { Id } from '@power-cms/common/domain';
import { Db } from 'mongodb';
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
  let id: string;
  let remoteProcedure: IRemoteProcedure;

  beforeAll(async () => {
    remoteProcedure = new RemoteProcedureMock();

    container = await createContainer(undefined, remoteProcedure);
  });

  beforeEach(async () => {
    (await container.resolve<Db>('db')).dropDatabase();
    const user = await container.resolve<CreateAction>('userCreateAction').execute({ data: properData });
    id = user.id;
  });

  it('Deletes single user', async () => {
    const action = container.resolve<DeleteAction>('userDeleteAction');
    await action.execute({ params: { id } });

    const readAction = container.resolve<ReadAction>('userReadAction');
    const handler = readAction.execute({ params: { id: Id.generate().toString() } });

    await expect(handler).rejects.toThrowError(UserNotFoundException);
  });

  it('Calls authorize action if id not matching', async () => {
    const action = container.resolve<DeleteAction>('userDeleteAction');

    await action.authorize({ auth: { id }, data: {} });
    expect(remoteProcedure.call).toBeCalled();
  });
});
