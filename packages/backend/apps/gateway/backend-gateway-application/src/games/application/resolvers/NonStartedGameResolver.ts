import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { Context } from '../../../foundation/graphql/application/models/Context';

@Injectable()
export class NonStartedGameResolver
  implements graphqlModels.NonStartedGameResolvers<Context>
{
  public id(parent: graphqlModels.NonStartedGame): string {
    return parent.id;
  }

  public name(parent: graphqlModels.NonStartedGame): string | null {
    return parent.name;
  }

  public async spec(
    parent: graphqlModels.NonStartedGame,
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
    parent: graphqlModels.NonStartedGame,
  ): graphqlModels.ResolverTypeWrapper<graphqlModels.NonStartedGameState> {
    return parent.state;
  }
}
