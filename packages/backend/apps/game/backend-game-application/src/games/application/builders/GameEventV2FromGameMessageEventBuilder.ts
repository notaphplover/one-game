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
import { GameMessageEvent } from '../models/GameMessageEvent';
import { GameMessageEventKind } from '../models/GameMessageEventKind';
import { GameUpdatedMessageEvent } from '../models/GameUpdatedMessageEvent';

@Injectable()
export class GameEventV2FromGameMessageEventBuilder
  implements
    Builder<[string | null, apiModels.GameEventV2], [GameMessageEvent]>
{
  readonly #cardV1FromCardBuilder: Builder<apiModels.CardV1, [Card]>;

  constructor(
    @Inject(CardV1FromCardBuilder)
    cardV1FromCardBuilder: Builder<apiModels.CardV1, [Card]>,
  ) {
    this.#cardV1FromCardBuilder = cardV1FromCardBuilder;
  }

  public build(
    gameMessageEvent: GameMessageEvent,
  ): [string | null, apiModels.GameEventV2] {
    switch (gameMessageEvent.kind) {
      case GameMessageEventKind.gameUpdated:
        return this.#buildFromGameUpdatedMessageEvent(gameMessageEvent);
    }
  }

  #buildFromGameUpdatedMessageEvent(
    gameUpdatedMessageEvent: GameUpdatedMessageEvent,
  ): [string | null, apiModels.GameEventV2] {
    const gameEvent: apiModels.GameEventV2 = this.#buildGameEventV2(
      gameUpdatedMessageEvent.game,
      gameUpdatedMessageEvent.gameAction,
    );

    return [gameUpdatedMessageEvent.gameAction.id, gameEvent];
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
    game: Game,
    gameAction: PlayCardsGameAction,
  ): apiModels.CardsPlayedGameEventV2 {
    return {
      cards: gameAction.cards.map((card: Card) =>
        this.#cardV1FromCardBuilder.build(card),
      ),
      currentCard: this.#getCurrentCard(game),
      currentPlayingSlotIndex: gameAction.currentPlayingSlotIndex,
      kind: 'cardsPlayed',
      position: gameAction.position,
    };
  }

  #buildGameEventV2(game: Game, gameAction: GameAction): apiModels.GameEventV2 {
    switch (gameAction.kind) {
      case GameActionKind.draw:
        return this.#buildCardsDrawnGameEventV2(gameAction);
      case GameActionKind.passTurn:
        return this.#buildTurnPassedGameEventV2(game, gameAction);
      case GameActionKind.playCards:
        return this.#buildCardsPlayedGameEventV2(game, gameAction);
    }
  }

  #buildTurnPassedGameEventV2(
    game: Game,
    gameAction: PassTurnGameAction,
  ): apiModels.TurnPassedGameEventV2 {
    return {
      currentPlayingSlotIndex: gameAction.currentPlayingSlotIndex,
      kind: 'turnPassed',
      nextPlayingSlotIndex: this.#getNextPlayingSlotIndex(game),
      position: gameAction.position,
    };
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
