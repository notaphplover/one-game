import React from 'react';

import { selectAuthenticatedAuth } from '../../app/store/features/authSlice';
import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';
import { useAppSelector } from '../../app/store/hooks';
import { Home } from '../components/Home';
import { HomeWithAuth } from '../components/HomeWithAuth';

export const CornieHome = (): React.JSX.Element => {
  const auth: AuthenticatedAuthState | null = useAppSelector(
    selectAuthenticatedAuth,
  );

  if (auth === null) {
    return <Home />;
  } else {
    return <HomeWithAuth />;
  }
};
