import { models as apiModels } from '@cornie-js/api-models';
import { JwtService } from '@cornie-js/backend-app-jwt';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import {
  User,
  UserCanCreateAuthSpec,
} from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';

import {
  BcryptHashProviderOutputPort,
  bcryptHashProviderOutputPortSymbol,
} from '../../../../foundation/hash/application/ports/output/BcryptHashProviderOutputPort';
import { UserJwtPayload } from '../../../../users/application/models/UserJwtPayload';
import {
  UserPersistenceOutputPort,
  userPersistenceOutputPortSymbol,
} from '../../../../users/application/ports/output/UserPersistenceOutputPort';

@Injectable()
export class AuthManagementInputPort {
  readonly #bcryptHashProviderOutputPort: BcryptHashProviderOutputPort;
  readonly #jwtService: JwtService<UserJwtPayload>;
  readonly #userCanCreateAuthSpec: UserCanCreateAuthSpec;
  readonly #userPersistenceOuptutPort: UserPersistenceOutputPort;

  constructor(
    @Inject(bcryptHashProviderOutputPortSymbol)
    bcryptHashProviderOutputPort: BcryptHashProviderOutputPort,
    @Inject(JwtService)
    jwtService: JwtService<UserJwtPayload>,
    @Inject(UserCanCreateAuthSpec)
    userCanCreateAuthSpec: UserCanCreateAuthSpec,
    @Inject(userPersistenceOutputPortSymbol)
    userPersistenceOuptutPort: UserPersistenceOutputPort,
  ) {
    this.#bcryptHashProviderOutputPort = bcryptHashProviderOutputPort;
    this.#jwtService = jwtService;
    this.#userCanCreateAuthSpec = userCanCreateAuthSpec;
    this.#userPersistenceOuptutPort = userPersistenceOuptutPort;
  }

  public async create(
    authCreateQueryV1: apiModels.AuthCreateQueryV1,
  ): Promise<apiModels.AuthV1> {
    const user: User = await this.#getUser(authCreateQueryV1);

    if (!this.#userCanCreateAuthSpec.isSatisfiedBy(user)) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        'Unable to generate user credentials due to the current user state',
      );
    }

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
