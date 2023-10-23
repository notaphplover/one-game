import { useSelector } from 'react-redux';
import { Home } from '../components/Home';
import { HomeWithAuth } from '../components/HomeWithAuth';

export const CornieHome = () => {
  const { token } = useSelector((state) => state.auth);

  if (token === null) {
    return <Home />;
  } else {
    return <HomeWithAuth />;
  }
};
