import { UuidModule } from '@cornie-js/backend-app-uuid';
import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';

import { CardModule } from '../../../../cards/adapter/nest/modules/CardModule';
import { CreateGameInitialSnapshotUseCaseHandler } from '../../../application/handlers/CreateGameInitialSnapshotUseCaseHandler';

@Module({})
export class GameSnapshotApplicationModule {
  public static forRootAsync(
    imports?: Array<
      Type<unknown> | DynamicModule | Promise<DynamicModule> | ForwardReference
    >,
  ): DynamicModule {
    return {
      exports: [CreateGameInitialSnapshotUseCaseHandler],
      global: false,
      imports: [...(imports ?? []), UuidModule, CardModule],
      module: GameSnapshotApplicationModule,
      providers: [CreateGameInitialSnapshotUseCaseHandler],
    };
  }
}
