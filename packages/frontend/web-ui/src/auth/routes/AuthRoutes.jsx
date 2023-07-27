import { Navigate, Route, Routes } from 'react-router-dom';
import { Login, Register } from '../pages';


export const AuthRoutes = () => {
  return (
    <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route path="/*" element={<Navigate to="/auth/login" />} />
    </Routes>
  )
}
