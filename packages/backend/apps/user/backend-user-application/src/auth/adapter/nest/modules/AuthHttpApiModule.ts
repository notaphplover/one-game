import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';

import { HttpModule } from '../../../../foundation/http/adapter/nest/modules/HttpModule';
import { JsonSchemaModule } from '../../../../foundation/jsonSchema/adapter/nest/modules/JsonSchemaModule';
import { PostAuthV1HttpRequestController } from '../../../application/controllers/PostAuthV1HttpRequestController';
import { PostAuthV1RequestParamHandler } from '../../../application/handlers/PostAuthV1RequestParamHandler';
import { AuthApplicationModule } from './AuthApplicationModule';

@Module({})
export class AuthHttpApiModule {
  public static forRootAsync(
    userImports?: Array<
      Type<unknown> | DynamicModule | Promise<DynamicModule> | ForwardReference
    >,
  ): DynamicModule {
    return {
      exports: [PostAuthV1HttpRequestController],
      global: false,
      imports: [
        ...(userImports ?? []),
        AuthApplicationModule.forRootAsync(),
        JsonSchemaModule,
        HttpModule,
      ],
      module: AuthHttpApiModule,
      providers: [PostAuthV1RequestParamHandler],
    };
  }
}
