import { IContainer } from '@power-cms/common/application';
import { Id, PersistanceException } from '@power-cms/common/src/domain';
import { Collection, Db } from 'mongodb';
import MongoMemoryServer from 'mongodb-memory-server';
import { User } from '../domain/user';
import { IUserRepository } from '../domain/user.repository';
import { createContainer } from './awilix.container';

const MockCollection = jest.fn<Collection>(() => ({
  insertOne: jest.fn(() => {
    throw new Error();
  }),
}));

const properData = new User(Id.generate(), 'User', 'user@test.com');

describe('Mongodb handler', () => {
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
  });

  it('Throws persistance exception', async () => {
    const db = await container.resolve<Db>('db');
    db.collection = MockCollection;

    const mongoHandler: IUserRepository = container.resolve<IUserRepository>('userRepository');

    await expect(mongoHandler.create(properData)).rejects.toThrowError(PersistanceException);
    await expect(mongoHandler.update(properData)).rejects.toThrowError(PersistanceException);
    await expect(mongoHandler.delete(Id.generate().toString())).rejects.toThrowError(PersistanceException);
    await expect(mongoHandler.grantRoles(Id.generate(), ['Admin'])).rejects.toThrowError(PersistanceException);
  });
});
