import { Module } from '@nestjs/common';
import { ApiJsonSchemasValidationProvider } from '@one-game-js/backend-api-validators';

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
