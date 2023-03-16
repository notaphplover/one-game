export interface UserJwtPayload extends Record<string | symbol, unknown> {
  aud: string;
  iat: number;
  iss: string;
  sub: string;
}
