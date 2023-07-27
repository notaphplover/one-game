import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './features/auth';

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
    },
});
