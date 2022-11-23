import path from 'node:path';

import { ResourceLocation } from '../../resource/models/ResourceLocation';
import { ResourceLocationType } from '../../resource/models/ResourceLocationType';

export function jsonSchemaRefToResourceLocation(
  referenceHostToSchemasRootDirectoryMap: Map<string, string>,
  ref: string,
  baseRef?: string | undefined,
): ResourceLocation {
  const urlObject: URL = new URL(ref, baseRef);
  const urlHost: string = urlObject.hostname;
  const urlPathName: string = urlObject.pathname;

  const schemasRootDirectory: string | undefined =
    referenceHostToSchemasRootDirectoryMap.get(urlHost);

  let resourceLocation: ResourceLocation;

  if (schemasRootDirectory === undefined) {
    resourceLocation = {
      rawLocation: urlObject.href,
      type: ResourceLocationType.url,
    };
  } else {
    resourceLocation = {
      rawLocation: path.join(schemasRootDirectory, ...urlPathName.split('/')),
      type: ResourceLocationType.fsPath,
    };
  }

  return resourceLocation;
}
