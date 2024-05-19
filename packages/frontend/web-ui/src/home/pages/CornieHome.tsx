import React from 'react';

import { selectAuth } from '../../app/store/features/authSlice';
import { AuthState } from '../../app/store/helpers/models/AuthState';
import { AuthStateStatus } from '../../app/store/helpers/models/AuthStateStatus';
import { useAppSelector } from '../../app/store/hooks';
import { Home } from '../components/Home';
import { HomeWithAuth } from '../components/HomeWithAuth';

export const CornieHome = (): React.JSX.Element => {
  const auth: AuthState = useAppSelector(selectAuth);

  if (auth.status === AuthStateStatus.nonAuthenticated) {
    return <Home />;
  } else {
    return <HomeWithAuth />;
  }
};
