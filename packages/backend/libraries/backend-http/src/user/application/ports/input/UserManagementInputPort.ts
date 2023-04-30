import { models as apiModels } from '@cornie-js/api-models';

export interface UserManagementInputPort {
  findOne(id: string): Promise<apiModels.UserV1 | undefined>;
}
