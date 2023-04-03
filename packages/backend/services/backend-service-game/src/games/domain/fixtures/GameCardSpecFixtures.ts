import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { GameCardSpec } from '../models/GameCardSpec';

export class GameCardSpecFixtures {
  public static get any(): GameCardSpec {
    return {
      amount: 4,
      card: CardFixtures.any,
    };
  }
}
