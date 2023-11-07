import { Profile } from 'pprof-format';

export interface Profiler {
  start(): void;

  stop(): Profile | null;

  profile(): Profile;
}
