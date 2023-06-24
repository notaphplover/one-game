import { UuidContext } from '../../../foundation/common/application/models/UuidContext';

export interface GameOptionsCreateQueryContext extends UuidContext {
  gameId: string;
}
