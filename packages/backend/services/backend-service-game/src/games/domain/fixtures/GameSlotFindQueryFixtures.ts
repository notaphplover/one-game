import { GameSlotFindQuery } from '../query/GameSlotFindQuery';

export class GameSlotFindQueryFixtures {
  public static get any(): GameSlotFindQuery {
    return {};
  }

  public static get withId(): GameSlotFindQuery {
    return {
      ...GameSlotFindQueryFixtures.any,
      id: '0aeea653-4749-4c93-878e-7c6df7f6fe4a',
    };
  }
}
