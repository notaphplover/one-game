import { OneGameApiWorld } from '../../../http/models/OneGameApiWorld';
import { AuthV2Parameter } from '../../models/AuthV2Parameter';

export function getAuthOrFail(
  this: OneGameApiWorld,
  alias: string,
): AuthV2Parameter {
  const authV2Parameter: AuthV2Parameter | undefined =
    this.entities.auth.get(alias);

  if (authV2Parameter === undefined) {
    throw new Error(`Expected "${alias}" aliased auth not found`);
  }

  return authV2Parameter;
}
