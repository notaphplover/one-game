import { Route, Routes } from 'react-router-dom';
import { AboutUs } from '../pages/AboutUs';

export const AboutUsRoutes = (): React.JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<AboutUs />} />
    </Routes>
  );
};
