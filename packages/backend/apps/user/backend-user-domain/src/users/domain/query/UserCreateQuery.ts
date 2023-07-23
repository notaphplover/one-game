export interface UserCreateQuery {
  readonly active: false;
  readonly email: string;
  readonly id: string;
  readonly name: string;
  readonly passwordHash: string;
}
