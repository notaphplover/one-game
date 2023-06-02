import { AfterAll } from '@cucumber/cucumber';

import { applicationContext } from '../../nest/contexts/applicationContext';

AfterAll(async function () {
  await (await applicationContext).close();
});
