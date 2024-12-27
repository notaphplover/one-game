import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';

import { AuthApplicationModule } from '../../../../auth/adapter/nest/modules/AuthApplicationModule';
import { HttpModule } from '../../../../foundation/http/adapter/nest/modules/HttpModule';
import { JsonSchemaModule } from '../../../../foundation/jsonSchema/adapter/nest/modules/JsonSchemaModule';
import { DeleteV1UsersEmailCodeRequestController } from '../../../application/controllers/DeleteV1UsersEmailCodeRequestController';
import { DeleteV1UsersMeHttpRequestController } from '../../../application/controllers/DeleteV1UsersMeHttpRequestController';
import { GetV1UsersHttpRequestController } from '../../../application/controllers/GetV1UsersHttpRequestController';
import { GetV1UsersMeDetailHttpRequestController } from '../../../application/controllers/GetV1UsersMeDetailHttpRequestController';
import { GetV1UsersMeHttpRequestController } from '../../../application/controllers/GetV1UsersMeHttpRequestController';
import { GetV1UsersUserIdHttpRequestController } from '../../../application/controllers/GetV1UsersUserIdHttpRequestController';
import { PatchV1UsersMeHttpRequestController } from '../../../application/controllers/PatchV1UsersMeHttpRequestController';
import { PostV1UsersEmailCodeRequestController } from '../../../application/controllers/PostV1UsersEmailCodeRequestController';
import { PostV1UsersHttpRequestController } from '../../../application/controllers/PostV1UsersHttpRequestController';
import { DeleteV1UsersEmailCodeRequestParamHandler } from '../../../application/handlers/DeleteV1UsersEmailCodeRequestParamHandler';
import { DeleteV1UsersMeRequestParamHandler } from '../../../application/handlers/DeleteV1UsersMeRequestParamHandler';
import { GetV1UsersMeRequestParamHandler } from '../../../application/handlers/GetV1UsersMeRequestParamHandler';
import { GetV1UsersRequestParamHandler } from '../../../application/handlers/GetV1UsersRequestParamHandler';
import { GetV1UsersUserIdRequestParamHandler } from '../../../application/handlers/GetV1UsersUserIdRequestParamHandler';
import { PatchV1UsersMeRequestBodyParamHandler } from '../../../application/handlers/PatchV1UsersMeRequestBodyParamHandler';
import { PatchV1UsersMeRequestParamHandler } from '../../../application/handlers/PatchV1UsersMeRequestParamHandler';
import { PostUserV1EmailCodeRequestParamHandler } from '../../../application/handlers/PostUserV1EmailCodeRequestParamHandler';
import { PostV1UsersEmailCodeRequestBodyParamHandler } from '../../../application/handlers/PostV1UsersEmailCodeRequestBodyParamHandler';
import { PostV1UsersRequestParamHandler } from '../../../application/handlers/PostV1UsersRequestParamHandler';
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
        DeleteV1UsersEmailCodeRequestController,
        DeleteV1UsersMeHttpRequestController,
        GetV1UsersHttpRequestController,
        GetV1UsersMeHttpRequestController,
        GetV1UsersMeDetailHttpRequestController,
        GetV1UsersUserIdHttpRequestController,
        PatchV1UsersMeHttpRequestController,
        PostV1UsersEmailCodeRequestController,
        PostV1UsersHttpRequestController,
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
        DeleteV1UsersEmailCodeRequestController,
        DeleteV1UsersEmailCodeRequestParamHandler,
        DeleteV1UsersMeHttpRequestController,
        DeleteV1UsersMeRequestParamHandler,
        GetV1UsersHttpRequestController,
        GetV1UsersMeDetailHttpRequestController,
        GetV1UsersMeHttpRequestController,
        GetV1UsersMeRequestParamHandler,
        GetV1UsersRequestParamHandler,
        GetV1UsersUserIdHttpRequestController,
        GetV1UsersUserIdRequestParamHandler,
        PatchV1UsersMeHttpRequestController,
        PatchV1UsersMeRequestBodyParamHandler,
        PatchV1UsersMeRequestParamHandler,
        PostV1UsersEmailCodeRequestController,
        PostV1UsersEmailCodeRequestBodyParamHandler,
        PostUserV1EmailCodeRequestParamHandler,
        PostV1UsersHttpRequestController,
        PostV1UsersRequestParamHandler,
      ],
    };
  }
}
