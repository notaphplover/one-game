import { models as apiModels } from '@cornie-js/api-models';
import { defineParameterType } from '@cucumber/cucumber';

defineParameterType({
  name: 'userCodeKind',
  regexp: /"(register confirm|reset password)"/,
  transformer: function (userCodeKind: string): apiModels.UserCodeKindV1 {
    switch (userCodeKind) {
      case 'register confirm':
        return 'registerConfirm';
      case 'reset password':
        return 'resetPassword';
      default:
        throw new Error(
          `Unexpected "${userCodeKind}" user code kind value found when parsing user code kind parameter`,
        );
    }
  },
});
