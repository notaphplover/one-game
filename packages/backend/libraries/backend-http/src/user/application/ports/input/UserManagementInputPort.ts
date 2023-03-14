import { models as apiModels } from '@one-game-js/api-models';

export interface UserManagementInputPort {
  findOne(id: string): Promise<apiModels.UserV1 | undefined>;
}
