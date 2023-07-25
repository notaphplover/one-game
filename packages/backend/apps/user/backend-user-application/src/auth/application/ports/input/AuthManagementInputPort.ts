import { models as apiModels } from '@cornie-js/api-models';
import { JwtService } from '@cornie-js/backend-app-jwt';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import {
  User,
  UserCanCreateAuthSpec,
  UserCode,
} from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';

import {
  BcryptHashProviderOutputPort,
  bcryptHashProviderOutputPortSymbol,
} from '../../../../foundation/hash/application/ports/output/BcryptHashProviderOutputPort';
import { UserJwtPayload } from '../../../../users/application/models/UserJwtPayload';
import {
  UserCodePersistenceOutputPort,
  userCodePersistenceOutputPortSymbol,
} from '../../../../users/application/ports/output/UserCodePersistenceOutputPort';
import {
  UserPersistenceOutputPort,
  userPersistenceOutputPortSymbol,
} from '../../../../users/application/ports/output/UserPersistenceOutputPort';

@Injectable()
export class AuthManagementInputPort {
  readonly #bcryptHashProviderOutputPort: BcryptHashProviderOutputPort;
  readonly #jwtService: JwtService<UserJwtPayload>;
  readonly #userCanCreateAuthSpec: UserCanCreateAuthSpec;
  readonly #userCodePersistenceOuptutPort: UserCodePersistenceOutputPort;
  readonly #userPersistenceOuptutPort: UserPersistenceOutputPort;

  constructor(
    @Inject(bcryptHashProviderOutputPortSymbol)
    bcryptHashProviderOutputPort: BcryptHashProviderOutputPort,
    @Inject(JwtService)
    jwtService: JwtService<UserJwtPayload>,
    @Inject(UserCanCreateAuthSpec)
    userCanCreateAuthSpec: UserCanCreateAuthSpec,
    @Inject(userCodePersistenceOutputPortSymbol)
    userCodePersistenceOuptutPort: UserCodePersistenceOutputPort,
    @Inject(userPersistenceOutputPortSymbol)
    userPersistenceOuptutPort: UserPersistenceOutputPort,
  ) {
    this.#bcryptHashProviderOutputPort = bcryptHashProviderOutputPort;
    this.#jwtService = jwtService;
    this.#userCanCreateAuthSpec = userCanCreateAuthSpec;
    this.#userCodePersistenceOuptutPort = userCodePersistenceOuptutPort;
    this.#userPersistenceOuptutPort = userPersistenceOuptutPort;
  }

  public async create(
    authCreateQueryV1: apiModels.AuthCreateQueryV1,
  ): Promise<apiModels.AuthV1> {
    let user: User;

    if (this.#isCodeAuthCreateQueryV1(authCreateQueryV1)) {
      user = await this.#getUserFromCodeAuthCreateQuery(authCreateQueryV1);
    } else {
      user = await this.#getUserFromEmailPasswordAuthCreateQuery(
        authCreateQueryV1,
      );
    }

    const jwt: string = await this.#generateJwt(user);

    return {
      jwt,
    };
  }

  async #getUserFromCodeAuthCreateQuery(
    codeAuthCreateQueryV1: apiModels.CodeAuthCreateQueryV1,
  ): Promise<User> {
    const userCodeOrUndefined: UserCode | undefined =
      await this.#userCodePersistenceOuptutPort.findOne({
        code: codeAuthCreateQueryV1.code,
      });

    if (userCodeOrUndefined === undefined) {
      this.#throwInvalidCredentialsError();
    }

    const userOrUndefined: User | undefined =
      await this.#userPersistenceOuptutPort.findOne({
        id: userCodeOrUndefined.userId,
      });

    if (userOrUndefined === undefined) {
      throw new AppError(
        AppErrorKind.unknown,
        'UserCode found, but no User associated was found',
      );
    }

    return userOrUndefined;
  }

  async #getUserFromEmailPasswordAuthCreateQuery(
    emailPasswordAuthCreateQueryV1: apiModels.EmailPasswordAuthCreateQueryV1,
  ): Promise<User> {
    const userOrUndefined: User | undefined =
      await this.#userPersistenceOuptutPort.findOne({
        email: emailPasswordAuthCreateQueryV1.email,
      });

    if (userOrUndefined === undefined) {
      this.#throwInvalidCredentialsError();
    }

    if (!this.#userCanCreateAuthSpec.isSatisfiedBy(userOrUndefined)) {
      throw new AppError(
        AppErrorKind.missingCredentials,
        'Unable to generate user credentials due to the current user state',
      );
    }

    await this.#validateCredentials(
      emailPasswordAuthCreateQueryV1,
      userOrUndefined,
    );

    return userOrUndefined;
  }

  async #generateJwt(user: User): Promise<string> {
    const userJwtPayload: Partial<UserJwtPayload> = {
      sub: user.id,
    };

    return this.#jwtService.create(userJwtPayload as UserJwtPayload);
  }

  #isCodeAuthCreateQueryV1(
    authCreateQueryV1: apiModels.AuthCreateQueryV1,
  ): authCreateQueryV1 is apiModels.CodeAuthCreateQueryV1 {
    return (
      (authCreateQueryV1 as apiModels.CodeAuthCreateQueryV1).code !== undefined
    );
  }

  async #validateCredentials(
    authCreateQueryV1: apiModels.EmailPasswordAuthCreateQueryV1,
    user: User,
  ): Promise<void> {
    const areValidCredentials: boolean =
      await this.#bcryptHashProviderOutputPort.verify(
        authCreateQueryV1.password,
        user.passwordHash,
      );

    if (!areValidCredentials) {
      this.#throwInvalidCredentialsError();
    }
  }

  #throwInvalidCredentialsError(): never {
    throw new AppError(AppErrorKind.missingCredentials, 'Invalid credentials');
  }
}
