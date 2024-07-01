import { models as apiModels } from '@cornie-js/api-models';
import { Builder, Handler } from '@cornie-js/backend-common';
import { Request, RequestWithBody } from '@cornie-js/backend-http';
import { User, UserCodeKind } from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';

import {
  UserPersistenceOutputPort,
  userPersistenceOutputPortSymbol,
} from '../ports/output/UserPersistenceOutputPort';
import { BaseUserV1EmailCodeRequestParamHandler } from './BaseUserV1EmailCodeRequestParamHandler';
import { PostUserV1EmailCodeRequestBodyParamHandler } from './PostUserV1EmailCodeRequestBodyParamHandler';

@Injectable()
export class PostUserV1EmailCodeRequestParamHandler
  extends BaseUserV1EmailCodeRequestParamHandler
  implements Handler<[Request], [User, UserCodeKind]>
{
  readonly #postUserV1EmailCodeRequestBodyParamHandler: Handler<
    [RequestWithBody],
    [apiModels.UserCodeCreateQueryV1]
  >;

  readonly #userCodeKindFromUserCodeKindV1Builder: Builder<
    UserCodeKind,
    [apiModels.UserCodeKindV1]
  >;

  constructor(
    @Inject(userPersistenceOutputPortSymbol)
    userPersistenceOutputPort: UserPersistenceOutputPort,
    @Inject(PostUserV1EmailCodeRequestBodyParamHandler)
    postUserV1EmailCodeRequestBodyParamHandler: Handler<
      [RequestWithBody],
      [apiModels.UserCodeCreateQueryV1]
    >,
    @Inject()
    userCodeKindFromUserCodeKindV1Builder: Builder<
      UserCodeKind,
      [apiModels.UserCodeKindV1]
    >,
  ) {
    super(userPersistenceOutputPort);

    this.#postUserV1EmailCodeRequestBodyParamHandler =
      postUserV1EmailCodeRequestBodyParamHandler;
    this.#userCodeKindFromUserCodeKindV1Builder =
      userCodeKindFromUserCodeKindV1Builder;
  }

  public async handle(request: Request): Promise<[User, UserCodeKind]> {
    const user: User = await this._getUserByRequestOrThrow(request);

    return [user, await this.#extractUserCodeKind(request)];
  }

  async #extractUserCodeKind(request: Request): Promise<UserCodeKind> {
    if (this.#isRequestWithBody(request)) {
      const [userCodeCreateQueryV1]: [apiModels.UserCodeCreateQueryV1] =
        await this.#postUserV1EmailCodeRequestBodyParamHandler.handle(request);

      return this.#userCodeKindFromUserCodeKindV1Builder.build(
        userCodeCreateQueryV1.kind,
      );
    } else {
      return UserCodeKind.registerConfirm;
    }
  }

  #isRequestWithBody(
    request: Request | RequestWithBody,
  ): request is RequestWithBody {
    return (request as Partial<RequestWithBody>).body !== undefined;
  }
}
