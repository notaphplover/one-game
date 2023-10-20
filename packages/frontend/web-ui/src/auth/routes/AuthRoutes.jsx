import { Navigate, Route, Routes } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { RegisterConfirm } from '../pages/RegisterConfirm';

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="register/confirm" element={<RegisterConfirm />} />

      <Route path="/*" element={<Navigate to="/auth/login" />} />
    </Routes>
  );
};
