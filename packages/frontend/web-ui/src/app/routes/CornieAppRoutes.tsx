import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthRoutes } from '../../auth/routes/AuthRoutes';
import { AboutUsRoutes } from '../../about/routes/AboutUsRoutes';
import { HomeRoutes } from '../../home/routes/HomeRoutes';
import { GameRoutes } from '../../game/routes/GameRoutes';

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
