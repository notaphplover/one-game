import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { CornieHome } from '../pages/CornieHome';

export const HomeRoutes = (): React.JSX.Element => {
  return (
    <Routes>
      {/* <Route path="/*" element={<Navigate to="/" />} /> */}
      <Route path="/" element={<CornieHome />} />
      {/* <Route path="/about" element={<AboutUs />} /> */}
    </Routes>
  );
};
