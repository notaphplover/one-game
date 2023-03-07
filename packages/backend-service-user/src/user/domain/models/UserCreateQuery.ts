export interface UserCreateQuery {
  readonly email: string;
  readonly id: string;
  readonly name: string;
  readonly passwordHash: string;
}
