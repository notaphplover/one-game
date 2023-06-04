import { OneGameApiWorld } from '../../../http/models/OneGameApiWorld';
import { AuthV1Parameter } from '../../models/AuthV1Parameter';

export function getAuthOrFail(
  this: OneGameApiWorld,
  alias: string,
): AuthV1Parameter {
  const authV1Parameter: AuthV1Parameter | undefined =
    this.entities.auth.get(alias);

  if (authV1Parameter === undefined) {
    throw new Error(`Expected "${alias}" aliased auth not found`);
  }

  return authV1Parameter;
}
