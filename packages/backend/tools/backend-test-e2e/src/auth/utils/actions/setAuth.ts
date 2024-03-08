import { OneGameApiWorld } from '../../../http/models/OneGameApiWorld';
import { AuthV2Parameter } from '../../models/AuthV2Parameter';

export function setAuth(
  this: OneGameApiWorld,
  alias: string,
  auth: AuthV2Parameter,
): void {
  this.entities.auth.set(alias, auth);
}
