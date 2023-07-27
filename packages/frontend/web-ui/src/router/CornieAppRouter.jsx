import { Route, Routes } from 'react-router-dom';
import { CornieHomeRoutes } from '../cornie/routes/CornieHomeRoutes';
import { AuthRoutes } from '../auth/routes/AuthRoutes';

export const CornieAppRouter = () => {
  
    return (
        <Routes>

            {/* Login and register */}
            <Route path="/auth/*" element={<AuthRoutes />}/>

            {/* Cornie App */}
            <Route path="/*" element={<CornieHomeRoutes />}/>

        </Routes>
    )
}
