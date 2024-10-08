import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import {
  GameCreateQuery,
  GameOptionsCreateQuery,
  GameService,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { GameCreateQueryContext } from '../models/GameCreateQueryContext';
import { GameOptionsCreateQueryContext } from '../models/GameOptionsCreateQueryContext';
import { GameOptionsCreateQueryFromGameOptionsV1Builder } from './GameOptionsCreateQueryFromGameOptionsV1Builder';

@Injectable()
export class GameCreateQueryFromGameCreateQueryV1Builder
  implements
    Builder<
      GameCreateQuery,
      [apiModels.GameCreateQueryV1, GameCreateQueryContext]
    >
{
  readonly #gameOptionsCreateQueryFromGameOptionsV1Builder: Builder<
    GameOptionsCreateQuery,
    [apiModels.GameOptionsV1, GameOptionsCreateQueryContext]
  >;
  readonly #gameService: GameService;

  constructor(
    @Inject(GameOptionsCreateQueryFromGameOptionsV1Builder)
    gameOptionsCreateQueryFromGameOptionsV1Builder: Builder<
      GameOptionsCreateQuery,
      [apiModels.GameOptionsV1, GameOptionsCreateQueryContext]
    >,
    @Inject(GameService)
    gameService: GameService,
  ) {
    this.#gameOptionsCreateQueryFromGameOptionsV1Builder =
      gameOptionsCreateQueryFromGameOptionsV1Builder;
    this.#gameService = gameService;
  }

  public build(
    gameCreateQueryV1: apiModels.GameCreateQueryV1,
    context: GameCreateQueryContext,
  ): GameCreateQuery {
    const gameOptionsCreateQueryContext: GameOptionsCreateQueryContext = {
      gameId: context.uuid,
      uuid: context.gameOptionsId,
    };

    const gameOptionsCreateQuery: GameOptionsCreateQuery =
      this.#gameOptionsCreateQueryFromGameOptionsV1Builder.build(
        gameCreateQueryV1.options,
        gameOptionsCreateQueryContext,
      );

    return {
      id: context.uuid,
      isPublic: gameCreateQueryV1.isPublic ?? false,
      name: gameCreateQueryV1.name,
      spec: {
        cards: this.#gameService.getInitialCardsSpec(),
        gameId: context.uuid,
        gameSlotsAmount: gameCreateQueryV1.gameSlotsAmount,
        id: context.gameSpecId,
        options: gameOptionsCreateQuery,
      },
    };
  }
}
