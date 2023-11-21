const MS_PER_SECOND: number = 1000;

export function dateToUnixTimestamp(date: Date): number {
  return Math.floor(date.getTime() / MS_PER_SECOND);
}
