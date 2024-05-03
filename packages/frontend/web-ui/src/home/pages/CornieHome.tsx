import React from 'react';
import { Home } from '../components/Home';
import { HomeWithAuth } from '../components/HomeWithAuth';
import { useAppSelector } from '../../app/store/hooks';
import { selectAuthenticatedAuth } from '../../app/store/features/authSlice';
import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';

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
