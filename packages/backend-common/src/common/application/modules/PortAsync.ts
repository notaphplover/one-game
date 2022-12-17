import { Port } from './Port';

export type PortAsync<TParams, TResult> = Port<TParams, Promise<TResult>>;
