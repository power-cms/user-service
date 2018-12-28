import { Acl, IActionHandler, IContainer, ILogger, IRemoteProcedure, IService } from '@power-cms/common/application';
import {
  createDatabaseConnection,
  MongodbPaginator,
  NullLogger,
  NullRemoteProcedure,
} from '@power-cms/common/infrastructure';
import * as awilix from 'awilix';
import { Db } from 'mongodb';
import { CollectionAction } from '../application/action/collection.action';
import { CreateAction } from '../application/action/create.action';
import { DeleteAction } from '../application/action/delete.action';
import { GetByLoginAction } from '../application/action/get-by-login.action';
import { GrantRolesAction } from '../application/action/grant-roles.action';
import { ReadAction } from '../application/action/read.action';
import { UpdateAction } from '../application/action/update.action';
import { CreateUserCommandHandler } from '../application/command/create-user.command-handler';
import { DeleteUserCommandHandler } from '../application/command/delete-user.command-handler';
import { GrantRolesCommandHandler } from '../application/command/grant-roles.command-handler';
import { UpdateUserCommandHandler } from '../application/command/update-user.command-handler';
import { IUserQuery } from '../application/query/user.query';
import { UserService } from '../application/service/service';
import { IUserRepository } from '../domain/user.repository';
import { MongodbUsers } from './mongodb.users';

export const createContainer = (logger?: ILogger, remoteProcedure?: IRemoteProcedure): IContainer => {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.CLASSIC,
  });

  container.register({
    logger: awilix.asValue<ILogger>(logger || new NullLogger()),
    remoteProcedure: awilix.asValue<IRemoteProcedure>(remoteProcedure || new NullRemoteProcedure()),
    acl: awilix.asClass<Acl>(Acl),

    db: awilix.asValue<Promise<Db>>(createDatabaseConnection()),

    paginator: awilix.asClass(MongodbPaginator),

    userRepository: awilix.asClass<IUserRepository>(MongodbUsers),
    userQuery: awilix.asClass<IUserQuery>(MongodbUsers),

    createUserHandler: awilix.asClass<CreateUserCommandHandler>(CreateUserCommandHandler),
    updateUserHandler: awilix.asClass<UpdateUserCommandHandler>(UpdateUserCommandHandler),
    deleteUserHandler: awilix.asClass<DeleteUserCommandHandler>(DeleteUserCommandHandler),
    grantRolesHandler: awilix.asClass<GrantRolesCommandHandler>(GrantRolesCommandHandler),

    userCreateAction: awilix.asClass<CreateAction>(CreateAction),
    userReadAction: awilix.asClass<ReadAction>(ReadAction),
    userUpdateAction: awilix.asClass<UpdateAction>(UpdateAction),
    userDeleteAction: awilix.asClass<DeleteAction>(DeleteAction),
    userCollectionAction: awilix.asClass<CollectionAction>(CollectionAction),
    userGetByLoginAction: awilix.asClass<GetByLoginAction>(GetByLoginAction),
    userGrantRolesAction: awilix.asClass<GrantRolesAction>(GrantRolesAction),

    service: awilix.asClass<IService>(UserService),
  });

  container.register({
    actions: awilix.asValue<IActionHandler[]>([
      container.resolve<CreateAction>('userCreateAction'),
      container.resolve<ReadAction>('userReadAction'),
      container.resolve<UpdateAction>('userUpdateAction'),
      container.resolve<DeleteAction>('userDeleteAction'),
      container.resolve<CollectionAction>('userCollectionAction'),
      container.resolve<GetByLoginAction>('userGetByLoginAction'),
      container.resolve<GrantRolesAction>('userGrantRolesAction'),
    ]),
  });

  return container;
};
