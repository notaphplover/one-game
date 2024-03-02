import { OneGameApiWorld } from '../../../http/models/OneGameApiWorld';
import { CardArrayV1Parameter } from '../../models/CardArrayV1Parameter';

export function getCardArrayOrFail(
  this: OneGameApiWorld,
  alias: string,
): CardArrayV1Parameter {
  const cardArrayV1Parameter: CardArrayV1Parameter | undefined =
    this.entities.cardArrays.get(alias);

  if (cardArrayV1Parameter === undefined) {
    throw new Error(`Expected card array "${alias}" to be found`);
  }

  return cardArrayV1Parameter;
}
