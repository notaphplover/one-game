import { Profile } from 'pprof-format';

export interface ProfileExporter {
  export(profile: Profile): Promise<void>;
}
