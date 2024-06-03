import getJsGlobalConfig from './config/getJsGlobalConfig.js';
import getTsGlobalConfig from './config/getTsGlobalConfig.js';

const babelJsGlobalConfig = getJsGlobalConfig();

const babelTsGlobalConfig = getTsGlobalConfig();

export { babelJsGlobalConfig, babelTsGlobalConfig };
