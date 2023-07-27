import { Route, Routes } from 'react-router-dom';
import { CornieHome, AboutUs } from '../pages';

export const CornieHomeRoutes = () => {
  return (
    <Routes>
        {/* <Route path="/*" element={<Navigate to="/" />} /> */}
        <Route path="/" element={<CornieHome />} />
        <Route path="/about" element={<AboutUs />} />
    </Routes>
  )
}
