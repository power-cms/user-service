import { ICreateRepository, Id, IDeleteRepository, IUpdateRepository } from '@power-cms/common/domain';
import { User } from './user';

export interface IUserRepository extends ICreateRepository<User>, IUpdateRepository<User>, IDeleteRepository {
  grantRoles: (id: Id, roles: string[]) => Promise<void>;
}
