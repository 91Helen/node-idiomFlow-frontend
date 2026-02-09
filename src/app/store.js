import { configureStore } from '@reduxjs/toolkit';
import { idiomsApi } from '../features/apiSlice';

export const store = configureStore({
  reducer: {
    [idiomsApi.reducerPath]: idiomsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(idiomsApi.middleware),
});