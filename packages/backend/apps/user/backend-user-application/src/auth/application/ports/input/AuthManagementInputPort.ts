import { models as apiModels } from '@cornie-js/api-models';
import { JwtService } from '@cornie-js/backend-app-jwt';
import {
  UuidProviderOutputPort,
  uuidProviderOutputPortSymbol,
} from '@cornie-js/backend-app-uuid';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import {
  RefreshToken,
  RefreshTokenCreateQuery,
  RefreshTokenFindQuery,
} from '@cornie-js/backend-user-domain/tokens';
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

const MS_PER_SECOND: number = 1000;

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

    const familyId: string = this.#uuidProviderOutputPort.generateV4();

    return this.#createAuthV2(familyId, user);
  }

  public async createByRefreshTokenV2(
    refreshTokenJwtPayload: RefreshTokenJwtPayload,
  ): Promise<apiModels.AuthV2> {
    const user: User = await this.#getUserFromRefreshTokenJtwPayload(
      refreshTokenJwtPayload,
    );

    const familyId: string = refreshTokenJwtPayload.familyId;

    return this.#createAuthV2(familyId, user);
  }

  async #banFamilyRefreshTokens(
    refreshTokenJwtPayload: RefreshTokenJwtPayload,
  ): Promise<void> {
    const thisAndNewerFamilyTokensFindQuery: RefreshTokenFindQuery =
      this.#buildGetThisAndNewerFamilyTokensFindQuery(refreshTokenJwtPayload);

    await this.#refreshTokenPersistenceOutputPort.update({
      active: false,
      findQuery: thisAndNewerFamilyTokensFindQuery,
    });
  }

  #buildGetThisAndNewerFamilyTokensFindQuery(
    refreshTokenJwtPayload: RefreshTokenJwtPayload,
  ): RefreshTokenFindQuery {
    return {
      active: true,
      date: {
        from: new Date(refreshTokenJwtPayload.iat * MS_PER_SECOND),
      },
      familyId: refreshTokenJwtPayload.familyId,
    };
  }

  async #createAuthV2(familyId: string, user: User): Promise<apiModels.AuthV2> {
    const refreshTokenId: string = this.#uuidProviderOutputPort.generateV4();

    const [accessToken, refreshToken]: [string, string] = await Promise.all([
      this.#generateAccessToken(user),
      this.#generateRefreshToken(familyId, refreshTokenId, user),
    ]);

    await this.#persistRefreshToken(familyId, refreshTokenId, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async #generateAccessToken(user: User): Promise<string> {
    const userJwtPayload: Partial<AccessTokenJwtPayload> = {
      sub: user.id,
    };

    return this.#jwtService.create(userJwtPayload);
  }

  async #generateRefreshToken(
    familyId: string,
    refreshTokenId: string,
    user: User,
  ): Promise<string> {
    const userJwtPayload: Partial<RefreshTokenJwtPayload> = {
      familyId: familyId,
      id: refreshTokenId,
      sub: user.id,
    };

    return this.#jwtService.create(userJwtPayload);
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

  async #getUserAndNewerRefreshTokensFromRefreshTokenJtwPayload(
    refreshTokenJwtPayload: RefreshTokenJwtPayload,
  ): Promise<[User | undefined, RefreshToken[]]> {
    const thisAndNewerFamilyTokensFindQuery: RefreshTokenFindQuery =
      this.#buildGetThisAndNewerFamilyTokensFindQuery(refreshTokenJwtPayload);

    return Promise.all([
      this.#userPersistenceOuptutPort.findOne({
        id: refreshTokenJwtPayload.sub,
      }),
      this.#refreshTokenPersistenceOutputPort.find({
        ...thisAndNewerFamilyTokensFindQuery,
        limit: 2,
      }),
    ]);
  }

  async #getUserFromRefreshTokenJtwPayload(
    refreshTokenJwtPayload: RefreshTokenJwtPayload,
  ): Promise<User> {
    const [user, refreshTokenValueObjects]: [User | undefined, RefreshToken[]] =
      await this.#getUserAndNewerRefreshTokensFromRefreshTokenJtwPayload(
        refreshTokenJwtPayload,
      );

    if (user === undefined || refreshTokenValueObjects.length !== 1) {
      if (refreshTokenValueObjects.length !== 0) {
        await this.#banFamilyRefreshTokens(refreshTokenJwtPayload);
      }

      this.#throwInvalidCredentialsError();
    }

    return user;
  }

  #isCodeAuthCreateQueryV1(
    authCreateQueryV1: apiModels.AuthCreateQueryV1,
  ): authCreateQueryV1 is apiModels.CodeAuthCreateQueryV1 {
    return (
      (authCreateQueryV1 as Partial<apiModels.CodeAuthCreateQueryV1>).code !==
      undefined
    );
  }

  async #persistRefreshToken(
    family: string,
    refreshTokenId: string,
    refreshToken: string,
  ): Promise<void> {
    const refreshTokenCreateQuery: RefreshTokenCreateQuery = {
      active: true,
      family,
      id: refreshTokenId,
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
