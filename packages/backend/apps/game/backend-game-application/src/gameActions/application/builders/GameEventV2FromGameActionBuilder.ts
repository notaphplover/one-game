import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { Card, CardColor } from '@cornie-js/backend-game-domain/cards';
import {
  DrawGameAction,
  GameAction,
  GameActionKind,
  PassTurnGameAction,
  PlayCardsGameAction,
} from '@cornie-js/backend-game-domain/gameActions';
import { GameDirection } from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { CardColorV1FromCardColorBuilder } from '../../../cards/application/builders/CardColorV1FromCardColorBuilder';
import { CardV1FromCardBuilder } from '../../../cards/application/builders/CardV1FromCardBuilder';
import { GameDirectionV1FromGameDirectionBuilder } from '../../../games/application/builders/GameDirectionV1FromGameDirectionBuilder';

@Injectable()
export class GameEventV2FromGameActionBuilder
  implements Builder<[string | null, apiModels.GameEventV2], [GameAction]>
{
  readonly #cardColorV1FromCardColorBuilder: Builder<
    apiModels.CardColorV1,
    [CardColor]
  >;
  readonly #cardV1FromCardBuilder: Builder<apiModels.CardV1, [Card]>;
  readonly #gameDirectionV1FromGameDirectionBuilder: Builder<
    apiModels.GameDirectionV1,
    [GameDirection]
  >;

  constructor(
    @Inject(CardColorV1FromCardColorBuilder)
    cardColorV1FromCardColorBuilder: Builder<
      apiModels.CardColorV1,
      [CardColor]
    >,
    @Inject(CardV1FromCardBuilder)
    cardV1FromCardBuilder: Builder<apiModels.CardV1, [Card]>,
    @Inject(GameDirectionV1FromGameDirectionBuilder)
    gameDirectionV1FromGameDirectionBuilder: Builder<
      apiModels.GameDirectionV1,
      [GameDirection]
    >,
  ) {
    this.#cardColorV1FromCardColorBuilder = cardColorV1FromCardColorBuilder;
    this.#cardV1FromCardBuilder = cardV1FromCardBuilder;
    this.#gameDirectionV1FromGameDirectionBuilder =
      gameDirectionV1FromGameDirectionBuilder;
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
    if (gameAction.stateUpdate.currentCard === null) {
      return {
        cards: gameAction.cards.map((card: Card) =>
          this.#cardV1FromCardBuilder.build(card),
        ),
        currentCard: null,
        currentColor: null,
        currentDirection: null,
        currentPlayingSlotIndex: gameAction.currentPlayingSlotIndex,
        drawCount: null,
        kind: 'cardsPlayed',
        position: gameAction.position,
      };
    } else {
      return {
        cards: gameAction.cards.map((card: Card) =>
          this.#cardV1FromCardBuilder.build(card),
        ),
        currentCard: this.#cardV1FromCardBuilder.build(
          gameAction.stateUpdate.currentCard,
        ),
        currentColor: this.#cardColorV1FromCardColorBuilder.build(
          gameAction.stateUpdate.currentColor,
        ),
        currentDirection: this.#gameDirectionV1FromGameDirectionBuilder.build(
          gameAction.stateUpdate.currentDirection,
        ),
        currentPlayingSlotIndex: gameAction.currentPlayingSlotIndex,
        drawCount: gameAction.stateUpdate.drawCount,
        kind: 'cardsPlayed',
        position: gameAction.position,
      };
    }
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
}
