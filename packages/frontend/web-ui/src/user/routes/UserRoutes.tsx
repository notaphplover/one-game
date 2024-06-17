import { Route, Routes } from 'react-router-dom';

import { UserInfo } from '../pages/UserInfo';

export const UserRoutes = (): React.JSX.Element => {
  return (
    <Routes>
      <Route path="/me" element={<UserInfo />} />
    </Routes>
  );
};
