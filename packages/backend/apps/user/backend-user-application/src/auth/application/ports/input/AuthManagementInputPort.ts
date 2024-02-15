import { models as apiModels } from '@cornie-js/api-models';
import { JwtService } from '@cornie-js/backend-app-jwt';
import {
  UuidProviderOutputPort,
  uuidProviderOutputPortSymbol,
} from '@cornie-js/backend-app-uuid';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { RefreshTokenCreateQuery } from '@cornie-js/backend-user-domain/tokens';
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
import { AccessTokenJwtPayload } from '../../../../tokens/application/models/AccessTokenJwtPayload';
import { RefreshTokenJwtPayload } from '../../../../tokens/application/models/RefreshTokenJwtPayload';
import {
  RefreshTokenPersistenceOutputPort,
  refreshTokenPersistenceOutputPortSymbol,
} from '../../../../tokens/application/ports/output/RefreshTokenPersistenceOutputPort';
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
  readonly #jwtService: JwtService;
  readonly #refreshTokenPersistenceOutputPort: RefreshTokenPersistenceOutputPort;
  readonly #userCanCreateAuthSpec: UserCanCreateAuthSpec;
  readonly #userCodePersistenceOuptutPort: UserCodePersistenceOutputPort;
  readonly #userPersistenceOuptutPort: UserPersistenceOutputPort;
  readonly #uuidProviderOutputPort: UuidProviderOutputPort;

  constructor(
    @Inject(bcryptHashProviderOutputPortSymbol)
    bcryptHashProviderOutputPort: BcryptHashProviderOutputPort,
    @Inject(JwtService)
    jwtService: JwtService,
    @Inject(refreshTokenPersistenceOutputPortSymbol)
    refreshTokenPersistenceOutputPort: RefreshTokenPersistenceOutputPort,
    @Inject(UserCanCreateAuthSpec)
    userCanCreateAuthSpec: UserCanCreateAuthSpec,
    @Inject(userCodePersistenceOutputPortSymbol)
    userCodePersistenceOuptutPort: UserCodePersistenceOutputPort,
    @Inject(userPersistenceOutputPortSymbol)
    userPersistenceOuptutPort: UserPersistenceOutputPort,
    @Inject(uuidProviderOutputPortSymbol)
    uuidProviderOutputPort: UuidProviderOutputPort,
  ) {
    this.#bcryptHashProviderOutputPort = bcryptHashProviderOutputPort;
    this.#jwtService = jwtService;
    this.#refreshTokenPersistenceOutputPort = refreshTokenPersistenceOutputPort;
    this.#userCanCreateAuthSpec = userCanCreateAuthSpec;
    this.#userCodePersistenceOuptutPort = userCodePersistenceOuptutPort;
    this.#userPersistenceOuptutPort = userPersistenceOuptutPort;
    this.#uuidProviderOutputPort = uuidProviderOutputPort;
  }

  public async create(
    authCreateQueryV1: apiModels.AuthCreateQueryV1,
  ): Promise<apiModels.AuthV1> {
    let user: User;

    if (this.#isCodeAuthCreateQueryV1(authCreateQueryV1)) {
      user = await this.#getUserFromCodeAuthCreateQuery(authCreateQueryV1.code);
    } else {
      user = await this.#getUserFromEmailPasswordAuthCreateQuery(
        authCreateQueryV1.email,
        authCreateQueryV1.password,
      );
    }

    const jwt: string = await this.#generateAccessToken(user);

    return {
      jwt,
    };
  }

  public async createByQueryV2(
    authCreateQueryV2: apiModels.AuthCreateQueryV2,
  ): Promise<apiModels.AuthV2> {
    const user: User =
      await this.#getUserFromAuthCreateQueryV2(authCreateQueryV2);

    const family: string = this.#uuidProviderOutputPort.generateV4();

    const [accessToken, refreshToken]: [string, string] = await Promise.all([
      this.#generateAccessToken(user),
      this.#generateRefreshToken(family, user),
    ]);

    await this.#persistRefreshToken(family, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async #getUserFromAuthCreateQueryV2(
    authCreateQueryV2: apiModels.AuthCreateQueryV2,
  ): Promise<User> {
    let user: User;

    switch (authCreateQueryV2.kind) {
      case 'code':
        user = await this.#getUserFromCodeAuthCreateQuery(
          authCreateQueryV2.code,
        );
        break;
      case 'login':
        user = await this.#getUserFromEmailPasswordAuthCreateQuery(
          authCreateQueryV2.email,
          authCreateQueryV2.password,
        );
        break;
    }

    return user;
  }

  async #getUserFromCodeAuthCreateQuery(code: string): Promise<User> {
    const userCodeOrUndefined: UserCode | undefined =
      await this.#userCodePersistenceOuptutPort.findOne({
        code,
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
    email: string,
    password: string,
  ): Promise<User> {
    const userOrUndefined: User | undefined =
      await this.#userPersistenceOuptutPort.findOne({
        email,
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

    await this.#validateCredentials(userOrUndefined, password);

    return userOrUndefined;
  }

  async #generateAccessToken(user: User): Promise<string> {
    const userJwtPayload: Partial<AccessTokenJwtPayload> = {
      sub: user.id,
    };

    return this.#jwtService.create(userJwtPayload);
  }

  async #generateRefreshToken(familyId: string, user: User): Promise<string> {
    const userJwtPayload: Partial<RefreshTokenJwtPayload> = {
      familyId: familyId,
      sub: user.id,
    };

    return this.#jwtService.create(userJwtPayload);
  }

  #isCodeAuthCreateQueryV1(
    authCreateQueryV1: apiModels.AuthCreateQueryV1,
  ): authCreateQueryV1 is apiModels.CodeAuthCreateQueryV1 {
    return (
      (authCreateQueryV1 as apiModels.CodeAuthCreateQueryV1).code !== undefined
    );
  }

  async #persistRefreshToken(
    family: string,
    refreshToken: string,
  ): Promise<void> {
    const refreshTokenCreateQuery: RefreshTokenCreateQuery = {
      active: true,
      family,
      id: this.#uuidProviderOutputPort.generateV4(),
      token: refreshToken,
    };

    await this.#refreshTokenPersistenceOutputPort.create(
      refreshTokenCreateQuery,
    );
  }

  async #validateCredentials(user: User, password: string): Promise<void> {
    const areValidCredentials: boolean =
      await this.#bcryptHashProviderOutputPort.verify(
        password,
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
