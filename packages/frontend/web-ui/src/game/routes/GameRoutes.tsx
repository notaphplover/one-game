import { Route, Routes } from 'react-router-dom';
import { CreateNewGame } from '../pages/CreateNewGame';

export const GameRoutes = (): React.JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<CreateNewGame />} />
    </Routes>
  );
};
