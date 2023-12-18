import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { Context } from '../../../foundation/graphql/application/models/Context';

@Injectable()
export class FinishedGameResolver
  implements graphqlModels.FinishedGameResolvers<Context>
{
  public id(parent: graphqlModels.FinishedGame): string {
    return parent.id;
  }

  public name(parent: graphqlModels.FinishedGame): string | null {
    return parent.name;
  }

  public async spec(
    parent: graphqlModels.FinishedGame,
    _args: unknown,
    context: Context,
  ): Promise<graphqlModels.GameSpec> {
    const gameSpec: graphqlModels.GameSpec | undefined =
      await context.gameSpecByGameIdHandler.handle(parent.id);

    if (gameSpec === undefined) {
      throw new AppError(
        AppErrorKind.unknown,
        `Unable to fetch game "${parent.id}" spec`,
      );
    }

    return gameSpec;
  }

  public state(
    parent: graphqlModels.FinishedGame,
  ): graphqlModels.ResolverTypeWrapper<graphqlModels.FinishedGameState> {
    return parent.state;
  }
}
