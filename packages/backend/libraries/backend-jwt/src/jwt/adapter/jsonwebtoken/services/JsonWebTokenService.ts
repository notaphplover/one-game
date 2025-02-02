import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import jwt from 'jsonwebtoken';

import { JwtServiceOptions } from '../../../application/models/JwtServiceOptions';
import { convertToJsonwebtokenAlgorithm } from '../converters/convertToJsonwebtokenAlgorithm';

export class JsonWebTokenService {
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
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      expiresIn: `${options.expirationMs} ms`,
      issuer: options.issuer,
    };

    this.#verifyOptions = {
      algorithms: [algorithm],
      audience: options.audience,
      complete: false,
      issuer: options.issuer,
    };
  }

  public async create(payload: Record<string, unknown>): Promise<string> {
    try {
      return await this.#promisifyJwtSign(payload);
    } catch (error: unknown) {
      this.#handleJsonWebTokenError(error);
    }
  }

  public async parse<TToken>(jwtToken: string): Promise<TToken> {
    try {
      return await this.#promisifyJwtVerify(jwtToken);
    } catch (error: unknown) {
      this.#handleJsonWebTokenError(error);
    }
  }

  #handleJsonWebTokenError(error: unknown): never {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError(AppErrorKind.missingCredentials, error.message, {
        cause: error,
      });
    } else {
      throw error;
    }
  }

  async #promisifyJwtSign(payload: Record<string, unknown>): Promise<string> {
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

  async #promisifyJwtVerify<TToken>(jwtToken: string): Promise<TToken> {
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
