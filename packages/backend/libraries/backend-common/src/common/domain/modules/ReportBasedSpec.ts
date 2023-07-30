import { Either } from '../patterns/fp/Either';

export interface ReportBasedSpec<TArgs extends unknown[], TReport> {
  isSatisfiedOrReport(...args: TArgs): Either<TReport, undefined>;
}
