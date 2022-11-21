import { JsonRootSchema202012, JsonSchema202012 } from './JsonSchema202012';

export interface TraverseJsonSchemaCallbackParams {
  schema: JsonSchema202012 | JsonRootSchema202012;
  jsonPointer: string;
  rootSchema: JsonRootSchema202012;
  parentJsonPointer: string | undefined;
  parentSchema: JsonSchema202012 | JsonRootSchema202012 | undefined;
}
