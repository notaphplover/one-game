import { Before } from '@cucumber/cucumber';
import { INestApplicationContext } from '@nestjs/common';

import { EnvironmentService } from '../../../../env/application/services/EnvironmentService';
import { OneGameApiWorld } from '../../../../http/models/OneGameApiWorld';
import { initializeWorld } from '../../../../http/utils/actions/initializeWorld';
import { applicationContext } from '../../nest/contexts/applicationContext';

Before<Partial<OneGameApiWorld>>(async function () {
  const resolvedApplicationContext: INestApplicationContext =
    await applicationContext;

  const environmentService: EnvironmentService =
    resolvedApplicationContext.get(EnvironmentService);

  initializeWorld.bind(this)(
    environmentService.getEnvironment().apiBackendBaseUrl,
  );
});
