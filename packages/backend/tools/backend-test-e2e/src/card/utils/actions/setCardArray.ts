import { OneGameApiWorld } from '../../../http/models/OneGameApiWorld';
import { CardArrayV1Parameter } from '../../models/CardArrayV1Parameter';

export function setCardArray(
  this: OneGameApiWorld,
  alias: string,
  cardArray: CardArrayV1Parameter,
): void {
  this.entities.cardArrays.set(alias, cardArray);
}
