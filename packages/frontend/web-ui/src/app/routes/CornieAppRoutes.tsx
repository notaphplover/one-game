import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { AuthRoutes } from '../../auth/routes/AuthRoutes';
import { GameRoutes } from '../../game/routes/GameRoutes';
import { HomeRoutes } from '../../home/routes/HomeRoutes';
import { UserRoutes } from '../../user/routes/UserRoutes';

export const CornieAppRoutes = (): React.JSX.Element => {
  return (
    <Routes>
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route path="/games/*" element={<GameRoutes />} />
      <Route path="/users/*" element={<UserRoutes />} />
      <Route path="/" element={<HomeRoutes />} />
    </Routes>
  );
};
