import { OneGameApiWorld } from '../../../http/models/OneGameApiWorld';
import { UserV1Parameter } from '../../models/UserV1Parameter';

export function setUser(
  this: OneGameApiWorld,
  alias: string,
  user: UserV1Parameter,
): void {
  this.entities.users.set(alias, user);
}
