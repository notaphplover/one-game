import { JsonSchema202012 } from '@one-game-js/json-schema-utils';

import { HttpClientMethodOptionsParameters } from './HttpClientMethodOptionsParameters';

export interface HttpClientMethodOptions {
  name: string;
  parameters: HttpClientMethodOptionsParameters;
  requestBodySchema?: JsonSchema202012;
}
