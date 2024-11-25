import React from 'react';
import { Route, Routes } from 'react-router';

import { AuthRoutes } from '../../auth/routes/AuthRoutes';
import { PageNotFound } from '../../common/pages/PageNotFound';
import { Game } from '../../game/pages/Game';
import { GameRoutes } from '../../game/routes/GameRoutes';
import { CornieHome } from '../../home/pages/CornieHome';
import { UserRoutes } from '../../user/routes/UserRoutes';

export const CornieAppRoutes = (): React.JSX.Element => {
  return (
    <Routes>
      <Route index element={<CornieHome />} />
      <Route path="auth">
        <Route index element={<PageNotFound />} />
        <Route path="*" element={<AuthRoutes />} />
      </Route>
      <Route path="games">
        <Route index element={<Game />} />
        <Route path="*" element={<GameRoutes />} />
      </Route>
      <Route path="users">
        <Route index element={<PageNotFound />} />
        <Route path="*" element={<UserRoutes />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};
