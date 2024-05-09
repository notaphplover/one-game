import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { AboutUsRoutes } from '../../about/routes/AboutUsRoutes';
import { AuthRoutes } from '../../auth/routes/AuthRoutes';
import { GameRoutes } from '../../game/routes/GameRoutes';
import { HomeRoutes } from '../../home/routes/HomeRoutes';

export const CornieAppRoutes = (): React.JSX.Element => {
  return (
    <Routes>
      {/* Login and register */}
      <Route path="/auth/*" element={<AuthRoutes />} />

      {/* Cornie App */}
      <Route path="/about" element={<AboutUsRoutes />} />
      <Route path="/*" element={<HomeRoutes />} />
      <Route path="/game/*" element={<GameRoutes />} />
    </Routes>
  );
};
