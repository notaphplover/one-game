import React from 'react';
import { Home } from '../components/Home';
import { HomeWithAuth } from '../components/HomeWithAuth';
import { useAppSelector } from '../../app/store/hooks';
import { selectAuthToken } from '../../app/store/features/authSlice';

export const CornieHome = (): React.JSX.Element => {
  const token = useAppSelector(selectAuthToken);

  if (token === null) {
    return <Home />;
  } else {
    return <HomeWithAuth />;
  }
};
