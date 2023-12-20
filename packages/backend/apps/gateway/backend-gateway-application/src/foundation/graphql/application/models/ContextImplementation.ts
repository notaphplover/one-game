import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { Builder, Handler } from '@cornie-js/backend-common';
import { Request } from '@cornie-js/backend-http';

import { Context } from './Context';

export class ContextImplementation implements Context {
  private _gameSpecByGameIdHandler:
    | Handler<[string], graphqlModels.GameSpec | undefined>
    | undefined;

  private readonly _gameSpecByGameIdHandlerBuilder: Builder<
    Handler<[string], graphqlModels.GameSpec | undefined>,
    [Request]
  >;

  constructor(
    public readonly request: Request,
    gameSpecByGameIdHandlerBuilder: Builder<
      Handler<[string], graphqlModels.GameSpec | undefined>,
      [Request]
    >,
  ) {
    this._gameSpecByGameIdHandler = undefined;
    this._gameSpecByGameIdHandlerBuilder = gameSpecByGameIdHandlerBuilder;
  }

  public get gameSpecByGameIdHandler(): Handler<
    [string],
    graphqlModels.GameSpec | undefined
  > {
    if (this._gameSpecByGameIdHandler === undefined) {
      this._gameSpecByGameIdHandler =
        this._gameSpecByGameIdHandlerBuilder.build(this.request);
    }

    return this._gameSpecByGameIdHandler;
  }
}
