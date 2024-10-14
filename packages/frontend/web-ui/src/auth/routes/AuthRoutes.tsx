import { Route, Routes } from 'react-router-dom';

import { AuthForgot } from '../pages/AuthForgot';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { RegisterConfirm } from '../pages/RegisterConfirm';
import { ResetPassword } from '../pages/ResetPassword';

export const AuthRoutes = (): React.JSX.Element => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="register/confirm" element={<RegisterConfirm />} />
      <Route path="forgot" element={<AuthForgot />} />
      <Route path="reset-password" element={<ResetPassword />} />
    </Routes>
  );
};
