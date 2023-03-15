import { Inject, Injectable } from '@nestjs/common';
import { models as apiModels } from '@one-game-js/api-models';
import { AppError, AppErrorKind } from '@one-game-js/backend-common';
import { JwtService } from '@one-game-js/backend-jwt';

import {
  BcryptHashProviderOutputPort,
  bcryptHashProviderOutputPortSymbol,
} from '../../../../foundation/hash/application/ports/output/BcryptHashProviderOutputPort';
import { UserJwtPayload } from '../../../../user/application/models/UserJwtPayload';
import {
  UserPersistenceOutputPort,
  userPersistenceOutputPortSymbol,
} from '../../../../user/application/ports/output/UserPersistenceOutputPort';
import { User } from '../../../../user/domain/models/User';

@Injectable()
export class AuthManagementInputPort {
  readonly #bcryptHashProviderOutputPort: BcryptHashProviderOutputPort;
  readonly #jwtService: JwtService<UserJwtPayload>;
  readonly #userPersistenceOuptutPort: UserPersistenceOutputPort;

  constructor(
    @Inject(bcryptHashProviderOutputPortSymbol)
    bcryptHashProviderOutputPort: BcryptHashProviderOutputPort,
    @Inject(JwtService)
    jwtService: JwtService<UserJwtPayload>,
    @Inject(userPersistenceOutputPortSymbol)
    userPersistenceOuptutPort: UserPersistenceOutputPort,
  ) {
    this.#bcryptHashProviderOutputPort = bcryptHashProviderOutputPort;
    this.#jwtService = jwtService;
    this.#userPersistenceOuptutPort = userPersistenceOuptutPort;
  }

  public async create(
    authCreateQueryV1: apiModels.AuthCreateQueryV1,
  ): Promise<apiModels.AuthV1> {
    const user: User = await this.#getUser(authCreateQueryV1);

    await this.#validateCredentials(authCreateQueryV1, user);

    const jwt: string = await this.#generateJwt(user);

    return {
      jwt,
    };
  }

  async #getUser(
    authCreateQueryV1: apiModels.AuthCreateQueryV1,
  ): Promise<User> {
    const userOrUndefined: User | undefined =
      await this.#userPersistenceOuptutPort.findOne({
        email: authCreateQueryV1.email,
      });

    if (userOrUndefined === undefined) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        'Invalid credentials',
      );
    }

    return userOrUndefined;
  }

  async #generateJwt(user: User): Promise<string> {
    const userJwtPayload: Partial<UserJwtPayload> = {
      sub: user.id,
    };

    return this.#jwtService.create(userJwtPayload as UserJwtPayload);
  }

  async #validateCredentials(
    authCreateQueryV1: apiModels.AuthCreateQueryV1,
    user: User,
  ): Promise<void> {
    const areValidCredentials: boolean =
      await this.#bcryptHashProviderOutputPort.verify(
        authCreateQueryV1.password,
        user.passwordHash,
      );

    if (!areValidCredentials) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        'Invalid credentials',
      );
    }
  }
}
