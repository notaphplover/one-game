import { OneGameApiWorld } from '../../../http/models/OneGameApiWorld';
import { UserParameterV1 } from '../../models/UserV1Parameter';

export function setUser(
  this: OneGameApiWorld,
  alias: string,
  user: UserParameterV1,
): void {
  this.entities.users.set(alias, user);
}
