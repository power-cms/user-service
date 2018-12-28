export class UserView {
  constructor(
    public id: string,
    public username: string,
    public email: string,
    public roles: string[],
    public avatar?: string
  ) {}
}
