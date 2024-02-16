import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';

import { HttpModule } from '../../../../foundation/http/adapter/nest/modules/HttpModule';
import { JsonSchemaModule } from '../../../../foundation/jsonSchema/adapter/nest/modules/JsonSchemaModule';
import { PostAuthV2HttpRequestController } from '../../../application';
import { PostAuthV1HttpRequestController } from '../../../application/controllers/PostAuthV1HttpRequestController';
import { PostAuthV1RequestParamHandler } from '../../../application/handlers/PostAuthV1RequestParamHandler';
import { PostAuthV2RequestBodyParamHandler } from '../../../application/handlers/PostAuthV2RequestBodyParamHandler';
import { PostAuthV2RequestParamHandler } from '../../../application/handlers/PostAuthV2RequestParamHandler';
import { AuthApplicationModule } from './AuthApplicationModule';

@Module({})
export class AuthHttpApiModule {
  public static forRootAsync(
    userImports?: Array<
      Type<unknown> | DynamicModule | Promise<DynamicModule> | ForwardReference
    >,
  ): DynamicModule {
    return {
      exports: [
        PostAuthV1HttpRequestController,
        PostAuthV2HttpRequestController,
      ],
      global: false,
      imports: [
        AuthApplicationModule.forRootAsync(userImports),
        JsonSchemaModule,
        HttpModule,
      ],
      module: AuthHttpApiModule,
      providers: [
        PostAuthV1HttpRequestController,
        PostAuthV1RequestParamHandler,
        PostAuthV2HttpRequestController,
        PostAuthV2RequestBodyParamHandler,
        PostAuthV2RequestParamHandler,
      ],
    };
  }
}
