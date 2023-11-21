import { ProfileExport } from './ProfileExporter';

export interface Profiler<TStartArgs> {
  start(args: TStartArgs): void;

  stop(): ProfileExport | null;

  profile(): ProfileExport;
}
