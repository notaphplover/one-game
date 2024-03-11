import React from 'react';
import { useSelector } from 'react-redux';
import { Home } from '../components/Home';
import { HomeWithAuth } from '../components/HomeWithAuth';

export const CornieHome = (): React.JSX.Element => {
  const { token } = useSelector((state: any) => state.auth);

  if (token === null) {
    return <Home />;
  } else {
    return <HomeWithAuth />;
  }
};
