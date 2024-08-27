import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { AuthRoutes } from '../../auth/routes/AuthRoutes';
import { PageNotFound } from '../../common/pages/PageNotFound';
import { GameRoutes } from '../../game/routes/GameRoutes';
import { CornieHome } from '../../home/pages/CornieHome';
import { UserRoutes } from '../../user/routes/UserRoutes';

export const CornieAppRoutes = (): React.JSX.Element => {
  return (
    <Routes>
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route path="/games/*" element={<GameRoutes />} />
      <Route path="/users/*" element={<UserRoutes />} />
      <Route path="/" element={<CornieHome />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};
