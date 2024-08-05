import { Function as PprofFunction, Profile } from 'pprof-format';

const V8_NAME_TO_GOLANG_NAME_MAP: Record<string, string> = {
  objects: 'inuse_objects',
  sample: 'samples',
  space: 'inuse_space',
};

export function processProfile(profile: Profile): Profile {
  adjustSampleNames(profile);
  adjustCwdPaths(profile);

  return profile;
}

function adjustCwdPaths(profile: Profile): void {
  for (const location of profile.location) {
    for (const line of location.line) {
      const functionId: number = Number(line.functionId);
      const contextFunction: PprofFunction | undefined =
        profile.function[functionId];

      if (contextFunction !== undefined) {
        const functionName: string | undefined =
          profile.stringTable.strings[Number(contextFunction.name)];

        if (!(functionName?.includes(':') ?? false)) {
          const fileName: string = profile.stringTable.strings[
            Number(contextFunction.filename)
          ] as string;

          const newName: string = `${fileName.replace(
            process.cwd(),
            '.',
          )}:${functionName ?? '[unknown]'}:${line.line.toString()}`;

          contextFunction.name = profile.stringTable.dedup(newName);
        }
      }
    }
  }
}

function adjustSampleNames(profile: Profile): void {
  // Replace the names of the samples to meet golang naming
  for (const valueType of profile.sampleType) {
    for (const [replacementsKey, replacementVal] of Object.entries(
      V8_NAME_TO_GOLANG_NAME_MAP,
    )) {
      const unit: string | undefined =
        profile.stringTable.strings[Number(valueType.unit)];

      if (unit === replacementsKey) {
        valueType.unit = profile.stringTable.dedup(replacementVal);
      }

      const type: string | undefined =
        profile.stringTable.strings[Number(valueType.type)];

      if (type === replacementsKey) {
        valueType.type = profile.stringTable.dedup(replacementVal);
      }
    }
  }
}
