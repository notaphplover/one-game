import { Route, Routes } from 'react-router-dom';
import { CornieApp } from '../pages';
import { AboutUs } from '../pages/AboutUs';

export const CornieHomeRoutes = () => {
  return (
    <Routes>
        {/* <Route path="/*" element={<Navigate to="/" />} /> */}
        <Route path="/" element={<CornieApp />} />
        <Route path="/about" element={<AboutUs />} />
    </Routes>
  )
}
