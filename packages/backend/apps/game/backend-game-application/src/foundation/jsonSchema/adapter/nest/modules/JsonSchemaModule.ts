import { ApiJsonSchemasValidationProvider } from '@cornie-js/backend-api-validators';
import { Module } from '@nestjs/common';

@Module({
  exports: [ApiJsonSchemasValidationProvider],
  providers: [
    {
      provide: ApiJsonSchemasValidationProvider,
      useFactory: async () => {
        const apiJsonSchemasValidationProvider: ApiJsonSchemasValidationProvider =
          new ApiJsonSchemasValidationProvider();

        await apiJsonSchemasValidationProvider.initialize();

        return apiJsonSchemasValidationProvider;
      },
    },
  ],
})
export class JsonSchemaModule {}
