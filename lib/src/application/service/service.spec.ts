import { IContainer } from '@power-cms/common/application';
import { createContainer } from '../../infrastructure/awilix.container';
import { UserService } from './service';

describe('Service', () => {
  let container: IContainer;

  beforeAll(async () => {
    container = await createContainer();
  });

  it('Creates service', async () => {
    const service = container.resolve<UserService>('service');

    expect(service.name).toBe('user');
    expect(Array.isArray(service.actions)).toBeTruthy();
  });
});
