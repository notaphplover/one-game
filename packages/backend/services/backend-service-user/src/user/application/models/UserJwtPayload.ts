export interface UserJwtPayload extends Record<string, unknown> {
  aud: string;
  iat: number;
  iss: string;
  sub: string;
}
