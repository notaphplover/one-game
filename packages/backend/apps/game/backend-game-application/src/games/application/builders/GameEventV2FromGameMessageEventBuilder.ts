import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { Card } from '@cornie-js/backend-game-domain/cards';
import { GameActionKind } from '@cornie-js/backend-game-domain/gameActions';
import {
  ActiveGame,
  Game,
  GameStatus,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { CardV1FromCardBuilder } from '../../../cards/application/builders/CardV1FromCardBuilder';
import { GameMessageEvent } from '../models/GameMessageEvent';
import { GameMessageEventKind } from '../models/GameMessageEventKind';
import { GameUpdatedMessageEvent } from '../models/GameUpdatedMessageEvent';

@Injectable()
export class GameEventV2FromGameMessageEventBuilder
  implements Builder<apiModels.GameEventV2, [GameMessageEvent]>
{
  readonly #cardV1FromCardBuilder: Builder<apiModels.CardV1, [Card]>;

  constructor(
    @Inject(CardV1FromCardBuilder)
    cardV1FromCardBuilder: Builder<apiModels.CardV1, [Card]>,
  ) {
    this.#cardV1FromCardBuilder = cardV1FromCardBuilder;
  }

  public build(gameMessageEvent: GameMessageEvent): apiModels.GameEventV2 {
    switch (gameMessageEvent.kind) {
      case GameMessageEventKind.gameUpdated:
        return this.#buildFromGameUpdatedMessageEvent(gameMessageEvent);
    }
  }

  #buildFromGameUpdatedMessageEvent(
    gameUpdatedMessageEvent: GameUpdatedMessageEvent,
  ): apiModels.GameEventV2 {
    switch (gameUpdatedMessageEvent.gameAction.kind) {
      case GameActionKind.draw:
        return {
          currentPlayingSlotIndex:
            gameUpdatedMessageEvent.gameAction.currentPlayingSlotIndex,
          drawAmount: gameUpdatedMessageEvent.gameAction.draw.length,
          kind: 'cardsDrawn',
          position: gameUpdatedMessageEvent.gameAction.position,
        };
      case GameActionKind.passTurn:
        return {
          currentPlayingSlotIndex:
            gameUpdatedMessageEvent.gameAction.currentPlayingSlotIndex,
          kind: 'turnPassed',
          nextPlayingSlotIndex: this.#getNextPlayingSlotIndex(
            gameUpdatedMessageEvent.game,
          ),
          position: gameUpdatedMessageEvent.gameAction.position,
        };
      case GameActionKind.playCards:
        return {
          cards: gameUpdatedMessageEvent.gameAction.cards.map((card: Card) =>
            this.#cardV1FromCardBuilder.build(card),
          ),
          currentCard: this.#getCurrentCard(gameUpdatedMessageEvent.game),
          currentPlayingSlotIndex:
            gameUpdatedMessageEvent.gameAction.currentPlayingSlotIndex,
          kind: 'cardsPlayed',
          position: gameUpdatedMessageEvent.gameAction.position,
        };
    }
  }

  #getCurrentCard(game: Game): Card | null {
    if (this.#isActiveGame(game)) {
      return game.state.currentCard;
    }

    return null;
  }

  #getNextPlayingSlotIndex(game: Game): number | null {
    if (this.#isActiveGame(game)) {
      return game.state.currentPlayingSlotIndex;
    }

    return null;
  }

  #isActiveGame(game: Game): game is ActiveGame {
    return game.state.status === GameStatus.active;
  }
}
