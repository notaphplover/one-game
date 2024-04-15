import { After } from '@cucumber/cucumber';

import { OneGameApiWorld } from '../../../../http/models/OneGameApiWorld';
import { disposeWorld } from '../../../../http/utils/actions/disposeWorld';

After<OneGameApiWorld>(async function (this: OneGameApiWorld) {
  await disposeWorld.bind(this)();
});
