import { readApiJsonSchemas } from '@cornie-js/api-json-schemas-provider';
import { JsonRootSchema202012 } from '@cornie-js/json-schema-utils';

import { AjvJsonSchemaValidatorProvider } from '../../../../validation/infrastructure/validatorProviders/ajv/AjvJsonSchemaValidatorProvider';

const jsonSchemasPromise: Promise<JsonRootSchema202012[]> =
  readApiJsonSchemas();

export class AjvApiJsonSchemasValidationProvider extends AjvJsonSchemaValidatorProvider {
  constructor() {
    super(async (): Promise<JsonRootSchema202012[]> => jsonSchemasPromise);
  }
}
