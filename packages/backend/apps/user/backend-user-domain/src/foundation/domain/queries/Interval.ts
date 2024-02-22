/**
 * Represents a 'left-closed, right-open' mathematical interval.
 *
 * { from: a, to: b } represents the interval [a, b)
 */
export interface Interval<T> {
  from?: T;
  to?: T;
}
