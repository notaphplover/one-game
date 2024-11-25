import { Route, Routes } from 'react-router';

import { PageNotFound } from '../../common/pages/PageNotFound';
import { UserInfo } from '../pages/UserInfo';

export const UserRoutes = (): React.JSX.Element => {
  return (
    <Routes>
      <Route path="me" element={<UserInfo />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};
