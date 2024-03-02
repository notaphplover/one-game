import { models as apiModels } from '@cornie-js/api-models';
import {
  GamePersistenceOutputPort,
  gamePersistenceOutputPortSymbol,
} from '@cornie-js/backend-game-application/games';
import { ColoredCard } from '@cornie-js/backend-game-domain/cards';
import { GameUpdateQuery } from '@cornie-js/backend-game-domain/games';
import { INestApplicationContext } from '@nestjs/common';

import { applicationContext } from '../../../app/adapter/nest/contexts/applicationContext';
import { CardArrayV1Parameter } from '../../../card/models/CardArrayV1Parameter';
import { CardV1Parameter } from '../../../card/models/CardV1Parameter';
import { UserV1Parameter } from '../../../user/models/UserV1Parameter';
import { GameV1Parameter } from '../../models/GameV1Parameter';

export async function setActiveGameCards(
  currentCardV1Parameter: CardV1Parameter,
  gameV1Parameter: GameV1Parameter,
  playerSettings: [UserV1Parameter, CardArrayV1Parameter][],
): Promise<void> {
  const game: apiModels.GameV1 = gameV1Parameter.game;

  if (game.state.status !== 'active') {
    throw new Error('Unexpected non active game when setting game cards');
  }

  const resolvedApplicationContext: INestApplicationContext =
    await applicationContext;

  const gamePersistenceOutputPort: GamePersistenceOutputPort =
    resolvedApplicationContext.get(gamePersistenceOutputPortSymbol);

  const gameUpdateQuery: GameUpdateQuery = {
    currentCard: currentCardV1Parameter.card,
    drawCount: 0,
    gameFindQuery: {
      id: gameV1Parameter.game.id,
    },
    gameSlotUpdateQueries: playerSettings.map(
      ([userV1Parameter, cardArrayV1Parameter]: [
        UserV1Parameter,
        CardArrayV1Parameter,
      ]) => ({
        cards: cardArrayV1Parameter.cards,
        gameSlotFindQuery: {
          gameId: gameV1Parameter.game.id,
          userId: userV1Parameter.user.id,
        },
      }),
    ),
    skipCount: 0,
  };

  const colorProperty: keyof ColoredCard = 'color';

  if (colorProperty in currentCardV1Parameter.card) {
    gameUpdateQuery.currentColor = currentCardV1Parameter.card.color;
  }

  await gamePersistenceOutputPort.update(gameUpdateQuery);
}
