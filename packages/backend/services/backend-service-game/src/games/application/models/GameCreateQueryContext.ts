import { UuidContext } from '../../../foundation/common/application/models/UuidContext';

export interface GameCreateQueryContext extends UuidContext {
  gameSlotUuids: string[];
}
