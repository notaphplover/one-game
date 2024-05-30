import { Route, Routes } from 'react-router-dom';

import { CreateNewGame } from '../pages/CreateNewGame';
import { JoinExistingGame } from '../pages/JoinExistingGame';

export const GameRoutes = (): React.JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<CreateNewGame />} />
      <Route path="joinGame" element={<JoinExistingGame />} />
    </Routes>
  );
};
