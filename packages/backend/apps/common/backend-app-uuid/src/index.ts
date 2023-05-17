import { UuidModule } from './adapter/nest/modules/UuidModule';
import {
  UuidProviderOutputPort,
  uuidProviderOutputPortSymbol,
} from './application/ports/output/UuidProviderOutputPort';

export type { UuidProviderOutputPort };

export { UuidModule, uuidProviderOutputPortSymbol };
