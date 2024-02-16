export interface RefreshTokenJwtPayload
  extends Record<string | symbol, unknown> {
  aud: string;
  familyId: string;
  iat: number;
  iss: string;
  sub: string;
}
