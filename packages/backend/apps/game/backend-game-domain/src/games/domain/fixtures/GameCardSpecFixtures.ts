import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { GameCardSpec } from '../valueObjects/GameCardSpec';

export class GameCardSpecFixtures {
  public static get any(): GameCardSpec {
    return {
      amount: 4,
      card: CardFixtures.any,
    };
  }

  public static get withAmount0(): GameCardSpec {
    return {
      ...GameCardSpecFixtures.any,
      amount: 0,
    };
  }

  public static get withAmount120(): GameCardSpec {
    return {
      ...GameCardSpecFixtures.any,
      amount: 120,
    };
  }
}
