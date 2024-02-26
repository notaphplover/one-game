export interface RefreshTokenCreateQuery {
  readonly active: boolean;
  readonly family: string;
  readonly id: string;
  readonly token: string;
}
