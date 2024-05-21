import { Mutex } from 'async-mutex';

export const refreshTokenMutex: Mutex = new Mutex();
