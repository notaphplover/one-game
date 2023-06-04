import { OneGameApiWorld } from '../../../http/models/OneGameApiWorld';
import { AuthV1Parameter } from '../../models/AuthV1Parameter';

export function setAuth(
  this: OneGameApiWorld,
  alias: string,
  auth: AuthV1Parameter,
): void {
  this.entities.auth.set(alias, auth);
}
