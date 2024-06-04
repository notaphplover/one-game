import { models as apiModels } from '@cornie-js/api-models';
import { createAction } from '@reduxjs/toolkit';

const login = createAction<apiModels.AuthV2, 'login'>('login');

export default login;
