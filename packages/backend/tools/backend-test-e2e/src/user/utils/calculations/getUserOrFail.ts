import { OneGameApiWorld } from '../../../http/models/OneGameApiWorld';
import { UserV1Parameter } from '../../models/UserV1Parameter';

export function getUserOrFail(
  this: OneGameApiWorld,
  alias: string,
): UserV1Parameter {
  const userParameterV1: UserV1Parameter | undefined =
    this.entities.users.get(alias);

  if (userParameterV1 === undefined) {
    throw new Error(`Expected "${alias}" aliased user not found`);
  }

  return userParameterV1;
}
