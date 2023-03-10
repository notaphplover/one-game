import { JsonRootSchema202012, JsonSchema202012 } from './JsonSchema202012';

export interface TraverseJsonSchemaCallbackParams {
  jsonPointer: string;
  parentJsonPointer: string | undefined;
  parentSchema: JsonSchema202012 | undefined;
  schema: JsonSchema202012 | JsonRootSchema202012;
}
