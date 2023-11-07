import { Function as PprofFunction, Profile } from 'pprof-format';

export function processProfile(profile: Profile): Profile {
  // eslint-disable-next-line @typescript-eslint/typedef
  const replacements: Record<string, string> = {
    objects: 'inuse_objects',
    sample: 'samples',
    space: 'inuse_space',
  };

  // Replace the names of the samples to meet golang naming
  for (const valueType of profile.sampleType) {
    for (const [replacementsKey, replacementVal] of Object.entries(
      replacements,
    )) {
      const unit: string | undefined =
        profile.stringTable.strings[valueType.unit as number];

      if (unit === replacementsKey) {
        valueType.unit = profile.stringTable.dedup(replacementVal);
      }

      const type: string | undefined =
        profile.stringTable.strings[valueType.type as number];

      if (type === replacementsKey) {
        valueType.type = profile.stringTable.dedup(replacementVal);
      }
    }
  }

  for (const location of profile.location) {
    for (const line of location.line) {
      const functionId: number | bigint = line.functionId;
      const contextFunction: PprofFunction | undefined = profile.function.find(
        (pprofFunction: PprofFunction) => pprofFunction.id == functionId,
      );

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
          )}:${functionName}:${line.line}`;

          contextFunction.name = profile.stringTable.dedup(newName);
        }
      }
    }
  }

  return profile;
}
