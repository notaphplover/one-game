import { Interval } from '../../../foundation/domain/queries/Interval';

export interface RefreshTokenFindQuery {
  readonly active?: boolean;
  readonly date?: Interval<Date>;
  readonly familyId?: string;
  readonly id?: string;
  readonly limit?: number;
  readonly offset?: number;
}
