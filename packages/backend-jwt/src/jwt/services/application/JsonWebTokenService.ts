import jwt from 'jsonwebtoken';

import { convertToJsonwebtokenAlgorithm } from '../../converters/jsonwebtoken/convertToJsonwebtokenAlgorithm';
import { JwtServiceOptions } from '../../models/application/JwtServiceOptions';

export class JsonWebTokenService<TToken extends Record<string, unknown>> {
  readonly #privateKey: string;
  readonly #publicKey: string;
  readonly #signOptions: jwt.SignOptions;
  readonly #verifyOptions: jwt.VerifyOptions & { complete: false };

  constructor(options: JwtServiceOptions) {
    this.#privateKey = options.privateKey;
    this.#publicKey = options.publicKey;

    const algorithm: jwt.Algorithm = convertToJsonwebtokenAlgorithm(
      options.algorithm,
    );

    this.#signOptions = {
      algorithm,
      audience: options.audience,
      expiresIn: options.expirationMs.toString(),
      issuer: options.issuer,
    };

    this.#verifyOptions = {
      algorithms: [algorithm],
      audience: options.audience,
      complete: false,
      issuer: options.issuer,
    };
  }

  public async create(payload: TToken): Promise<string> {
    return this.promisifyJwtSign(payload);
  }

  public async parse(jwtToken: string): Promise<TToken> {
    return this.promisifyJwtVerify(jwtToken);
  }

  private async promisifyJwtSign(payload: TToken): Promise<string> {
    return new Promise(
      (
        resolve: (value: string) => void,
        reject: (reason?: unknown) => void,
      ) => {
        jwt.sign(
          payload,
          this.#privateKey,
          this.#signOptions,
          (err: Error | null, encoded: string | undefined) => {
            if (err === null) {
              resolve(encoded as string);
            } else {
              reject(err);
            }
          },
        );
      },
    );
  }

  private async promisifyJwtVerify(jwtToken: string): Promise<TToken> {
    return new Promise(
      (
        resolve: (value: TToken) => void,
        reject: (reason?: unknown) => void,
      ) => {
        jwt.verify(
          jwtToken,
          this.#publicKey,
          this.#verifyOptions,
          (
            err: jwt.VerifyErrors | null,
            decoded: jwt.JwtPayload | string | undefined,
          ) => {
            if (err === null) {
              resolve(decoded as TToken);
            } else {
              reject(err);
            }
          },
        );
      },
    );
  }
}
