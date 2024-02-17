export interface RefreshTokenJwtPayload
  extends Record<string | symbol, unknown> {
  aud: string;
  familyId: string;
  iat: number;
  id: string;
  iss: string;
  sub: string;
}
