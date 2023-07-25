export interface User {
  readonly active: boolean;
  readonly email: string;
  readonly id: string;
  readonly name: string;
  readonly passwordHash: string;
}
