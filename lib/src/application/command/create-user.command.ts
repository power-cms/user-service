export interface ICreateUserCommand {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}
