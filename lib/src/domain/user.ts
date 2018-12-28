import { Id } from '@power-cms/common/domain';

export class User {
  constructor(
    private id: Id,
    private username: string,
    private email: string,
    private avatar?: string,
    private roles: string[] = []
  ) {}

  public getId(): Id {
    return this.id;
  }

  public getUsername(): string {
    return this.username;
  }

  public getEmail(): string {
    return this.email;
  }

  public getAvatar(): string | undefined {
    return this.avatar;
  }

  public getRoles(): string[] {
    return this.roles;
  }
}
