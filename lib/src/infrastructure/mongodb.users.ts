import { IPaginationView, Pagination } from '@power-cms/common/application';
import { Id, PersistanceException } from '@power-cms/common/domain';
import { MongodbPaginator, ObjectIDFactory } from '@power-cms/common/infrastructure';
import { Collection, Db } from 'mongodb';
import { IUserQuery } from '../application/query/user.query';
import { UserView } from '../application/query/user.view';
import { UserNotFoundException } from '../domain/exception/user-not-found.exception';
import { User } from '../domain/user';
import { IUserRepository } from '../domain/user.repository';

export class MongodbUsers implements IUserRepository, IUserQuery {
  private static COLLECTION_NAME = 'user';

  constructor(private readonly db: Promise<Db>, private paginator: MongodbPaginator) {}

  public async get(id: Id): Promise<UserView> {
    const collection = await this.getCollection();
    const user = await collection.findOne({ _id: ObjectIDFactory.fromDomainId(id) });

    if (user === null) {
      throw UserNotFoundException.withId(id);
    }

    return this.toView(user);
  }

  public async getByLogin(login: string): Promise<UserView> {
    const collection = await this.getCollection();
    const user = await collection.findOne({ $or: [{ username: login }, { email: login }] });

    if (user === null) {
      throw UserNotFoundException.withLogin(login);
    }

    return this.toView(user);
  }

  public async getAll(pagination: Pagination): Promise<IPaginationView<UserView>> {
    const collection = await this.getCollection();
    return this.paginator.paginate(collection, pagination, this.toView);
  }

  public async create(user: User): Promise<void> {
    try {
      const collection = await this.getCollection();
      await collection.insertOne({
        _id: ObjectIDFactory.fromDomainId(user.getId()),
        username: user.getUsername(),
        email: user.getEmail(),
        avatar: user.getAvatar(),
        roles: user.getRoles(),
      });
    } catch (e) {
      throw PersistanceException.fromError(e);
    }
  }

  public async update(user: User): Promise<void> {
    try {
      const collection = await this.getCollection();
      await collection.updateOne(
        { _id: ObjectIDFactory.fromDomainId(user.getId()) },
        {
          $set: {
            username: user.getUsername(),
            email: user.getEmail(),
            avatar: user.getAvatar(),
          },
        }
      );
    } catch (e) {
      throw PersistanceException.fromError(e);
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      const collection = await this.getCollection();
      await collection.deleteOne({ _id: ObjectIDFactory.fromString(id) });
    } catch (e) {
      throw PersistanceException.fromError(e);
    }
  }

  public async grantRoles(id: Id, roles: string[]): Promise<void> {
    try {
      const collection = await this.getCollection();
      await collection.updateOne({ _id: ObjectIDFactory.fromDomainId(id) }, { $set: { roles } });
    } catch (e) {
      throw PersistanceException.fromError(e);
    }
  }

  private toView(data: any): UserView {
    return new UserView(data._id.toString(), data.username, data.email, data.roles, data.avatar);
  }

  private async getCollection(): Promise<Collection> {
    const db = await this.db;

    return db.collection(MongodbUsers.COLLECTION_NAME);
  }
}
