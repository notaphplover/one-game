import { Either, ReportBasedSpec } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { GameCreateQuery } from '../query/GameCreateQuery';

const MIN_GAME_SLOTS_AMOUNT: number = 2;
const MAX_GAME_SLOTS_AMOUNT: number = 10;

@Injectable()
export class IsValidGameCreateQuerySpec
  implements ReportBasedSpec<[GameCreateQuery], string[]>
{
  public isSatisfiedOrReport(
    gamemeCreateQuery: GameCreateQuery,
  ): Either<string[], undefined> {
    const errors: string[] = [];

    if (!Number.isInteger(gamemeCreateQuery.spec.gameSlotsAmount)) {
      errors.push('Expecting an integer game slots amount');
    }

    if (
      gamemeCreateQuery.spec.gameSlotsAmount < MIN_GAME_SLOTS_AMOUNT ||
      gamemeCreateQuery.spec.gameSlotsAmount > MAX_GAME_SLOTS_AMOUNT
    ) {
      errors.push(
        `Expecting a game slots amount between ${MIN_GAME_SLOTS_AMOUNT} and ${MAX_GAME_SLOTS_AMOUNT}`,
      );
    }

    return errors.length === 0
      ? {
          isRight: true,
          value: undefined,
        }
      : {
          isRight: false,
          value: errors,
        };
  }
}
