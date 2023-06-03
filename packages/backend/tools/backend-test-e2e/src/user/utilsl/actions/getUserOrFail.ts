import { OneGameApiWorld } from '../../../http/models/OneGameApiWorld';
import { UserParameterV1 } from '../../models/UserV1Parameter';

export function getUserOrFail(
  this: OneGameApiWorld,
  alias: string,
): UserParameterV1 {
  const userParameterV1: UserParameterV1 | undefined =
    this.entities.users.get(alias);

  if (userParameterV1 === undefined) {
    throw new Error(`Expected "${alias}" aliased user not found`);
  }

  return userParameterV1;
}
