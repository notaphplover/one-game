import { Route, Routes } from 'react-router-dom';

import { CreateNewGame } from '../pages/CreateNewGame';
import { Game } from '../pages/Game';
import { JoinExistingGame } from '../pages/JoinExistingGame';
import { PublicGames } from '../pages/PublicGames';

export const GameRoutes = (): React.JSX.Element => {
  return (
    <Routes>
      <Route path="/create" element={<CreateNewGame />} />
      <Route path="/" element={<Game />} />
      <Route path="/join" element={<JoinExistingGame />} />
      <Route path="/public" element={<PublicGames />} />
    </Routes>
  );
};
