import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';

import { AuthApplicationModule } from '../../../../auth/adapter/nest/modules/AuthApplicationModule';
import { HttpModule } from '../../../../foundation/http/adapter/nest/modules/HttpModule';
import { JsonSchemaModule } from '../../../../foundation/jsonSchema/adapter/nest/modules/JsonSchemaModule';
import { DeleteUserV1EmailCodeRequestController } from '../../../application/controllers/DeleteUserV1EmailCodeRequestController';
import { DeleteUserV1MeHttpRequestController } from '../../../application/controllers/DeleteUserV1MeHttpRequestController';
import { GetUserV1MeDetailHttpRequestController } from '../../../application/controllers/GetUserV1MeDetailHttpRequestController';
import { GetUserV1MeHttpRequestController } from '../../../application/controllers/GetUserV1MeHttpRequestController';
import { GetUserV1UserIdHttpRequestController } from '../../../application/controllers/GetUserV1UserIdHttpRequestController';
import { PatchUserV1MeHttpRequestController } from '../../../application/controllers/PatchUserV1MeHttpRequestController';
import { PostUserV1EmailCodeRequestController } from '../../../application/controllers/PostUserV1EmailCodeRequestController';
import { PostUserV1HttpRequestController } from '../../../application/controllers/PostUserV1HttpRequestController';
import { DeleteUserV1EmailCodeRequestParamHandler } from '../../../application/handlers/DeleteUserV1EmailCodeRequestParamHandler';
import { DeleteUserV1MeRequestParamHandler } from '../../../application/handlers/DeleteUserV1MeRequestParamHandler';
import { GetUserV1MeRequestParamHandler } from '../../../application/handlers/GetUserV1MeRequestParamHandler';
import { GetUserV1UserIdRequestParamHandler } from '../../../application/handlers/GetUserV1UserIdRequestParamHandler';
import { PatchUserV1MeRequestBodyParamHandler } from '../../../application/handlers/PatchUserV1MeRequestBodyParamHandler';
import { PatchUserV1MeRequestParamHandler } from '../../../application/handlers/PatchUserV1MeRequestParamHandler';
import { PostUserV1EmailCodeRequestBodyParamHandler } from '../../../application/handlers/PostUserV1EmailCodeRequestBodyParamHandler';
import { PostUserV1EmailCodeRequestParamHandler } from '../../../application/handlers/PostUserV1EmailCodeRequestParamHandler';
import { PostUserV1RequestParamHandler } from '../../../application/handlers/PostUserV1RequestParamHandler';
import { UserApplicationModule } from './UserApplicationModule';

@Module({})
export class UserHttpApiModule {
  public static forRootAsync(
    userImports?: Array<
      Type<unknown> | DynamicModule | Promise<DynamicModule> | ForwardReference
    >,
  ): DynamicModule {
    return {
      exports: [
        DeleteUserV1EmailCodeRequestController,
        DeleteUserV1MeHttpRequestController,
        GetUserV1MeHttpRequestController,
        GetUserV1MeDetailHttpRequestController,
        GetUserV1UserIdHttpRequestController,
        PatchUserV1MeHttpRequestController,
        PostUserV1EmailCodeRequestController,
        PostUserV1HttpRequestController,
      ],
      global: false,
      imports: [
        ...(userImports ?? []),
        AuthApplicationModule.forRootAsync(userImports),
        UserApplicationModule.forRootAsync(userImports),
        JsonSchemaModule,
        HttpModule,
      ],
      module: UserHttpApiModule,
      providers: [
        DeleteUserV1EmailCodeRequestController,
        DeleteUserV1EmailCodeRequestParamHandler,
        DeleteUserV1MeHttpRequestController,
        DeleteUserV1MeRequestParamHandler,
        GetUserV1MeDetailHttpRequestController,
        GetUserV1MeHttpRequestController,
        GetUserV1MeRequestParamHandler,
        GetUserV1UserIdHttpRequestController,
        GetUserV1UserIdRequestParamHandler,
        PatchUserV1MeHttpRequestController,
        PatchUserV1MeRequestBodyParamHandler,
        PatchUserV1MeRequestParamHandler,
        PostUserV1EmailCodeRequestController,
        PostUserV1EmailCodeRequestBodyParamHandler,
        PostUserV1EmailCodeRequestParamHandler,
        PostUserV1HttpRequestController,
        PostUserV1RequestParamHandler,
      ],
    };
  }
}
