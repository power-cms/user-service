import { ICollectionQuery, ISingleQuery } from '@power-cms/common/application';
import { UserView } from './user.view';

export interface IUserQuery extends ISingleQuery<UserView>, ICollectionQuery<UserView> {
  getByLogin: (login: string) => Promise<UserView>;
}
