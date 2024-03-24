import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { Card } from '@cornie-js/backend-game-domain/cards';
import {
  DrawGameAction,
  GameAction,
  GameActionKind,
  PassTurnGameAction,
  PlayCardsGameAction,
} from '@cornie-js/backend-game-domain/gameActions';
import {
  ActiveGame,
  Game,
  GameStatus,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { CardV1FromCardBuilder } from '../../../cards/application/builders/CardV1FromCardBuilder';

@Injectable()
export class GameEventV2FromGameActionBuilder
  implements Builder<[string | null, apiModels.GameEventV2], [GameAction]>
{
  readonly #cardV1FromCardBuilder: Builder<apiModels.CardV1, [Card]>;

  constructor(
    @Inject(CardV1FromCardBuilder)
    cardV1FromCardBuilder: Builder<apiModels.CardV1, [Card]>,
  ) {
    this.#cardV1FromCardBuilder = cardV1FromCardBuilder;
  }

  public build(gameAction: GameAction): [string | null, apiModels.GameEventV2] {
    const gameEvent: apiModels.GameEventV2 = this.#buildGameEventV2(gameAction);

    return [gameAction.id, gameEvent];
  }

  #buildCardsDrawnGameEventV2(
    gameAction: DrawGameAction,
  ): apiModels.CardsDrawnGameEventV2 {
    return {
      currentPlayingSlotIndex: gameAction.currentPlayingSlotIndex,
      drawAmount: gameAction.draw.length,
      kind: 'cardsDrawn',
      position: gameAction.position,
    };
  }

  #buildCardsPlayedGameEventV2(
    gameAction: PlayCardsGameAction,
  ): apiModels.CardsPlayedGameEventV2 {
    return {
      cards: gameAction.cards.map((card: Card) =>
        this.#cardV1FromCardBuilder.build(card),
      ),
      currentCard:
        gameAction.currentCard === null
          ? null
          : this.#cardV1FromCardBuilder.build(gameAction.currentCard),
      currentPlayingSlotIndex: gameAction.currentPlayingSlotIndex,
      kind: 'cardsPlayed',
      position: gameAction.position,
    };
  }

  #buildGameEventV2(gameAction: GameAction): apiModels.GameEventV2 {
    switch (gameAction.kind) {
      case GameActionKind.draw:
        return this.#buildCardsDrawnGameEventV2(gameAction);
      case GameActionKind.passTurn:
        return this.#buildTurnPassedGameEventV2(gameAction);
      case GameActionKind.playCards:
        return this.#buildCardsPlayedGameEventV2(gameAction);
    }
  }

  #buildTurnPassedGameEventV2(
    gameAction: PassTurnGameAction,
  ): apiModels.TurnPassedGameEventV2 {
    return {
      currentPlayingSlotIndex: gameAction.currentPlayingSlotIndex,
      kind: 'turnPassed',
      nextPlayingSlotIndex: gameAction.nextPlayingSlotIndex,
      position: gameAction.position,
    };
  }

  #isActiveGame(game: Game): game is ActiveGame {
    return game.state.status === GameStatus.active;
  }
}
