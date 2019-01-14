import { IContainer, IPaginationView, IRemoteProcedure } from '@power-cms/common/application';
import { Id } from '@power-cms/common/domain';
import { Db } from 'mongodb';
import { createContainer } from '../../infrastructure/awilix.container';
import { UserView } from '../query/user.view';
import { CollectionAction } from './collection.action';
import { CreateAction } from './create.action';

const RemoteProcedureMock = jest.fn<IRemoteProcedure>(() => ({
  call: jest.fn(),
}));

const properData = {
  id: Id.generate().toString(),
  username: 'User',
  email: 'test@test.com',
};

describe('Collection action', () => {
  let container: IContainer;
  let id: string;
  let remoteProcedure: IRemoteProcedure;

  beforeAll(async () => {
    remoteProcedure = new RemoteProcedureMock();

    container = await createContainer(undefined, remoteProcedure);
  });

  beforeEach(async () => {
    (await container.resolve<Db>('db')).dropDatabase();
    const user = await container.resolve<CreateAction>('userCreateAction').handle({ data: properData });
    id = user.id;
  });

  it('Fetches user collection', async () => {
    const action = container.resolve<CollectionAction>('userCollectionAction');
    const result: IPaginationView<UserView> = await action.handle({});
    expect(result.data).toBeInstanceOf(Array);
    expect(result.data.length).toBe(1);
    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(1);
  });

  it('Calls authorize action if id not matching', async () => {
    const action = container.resolve<CollectionAction>('userCollectionAction');

    await action.authorize({ auth: { id }, data: {} });
    expect(remoteProcedure.call).toBeCalled();
  });
});
