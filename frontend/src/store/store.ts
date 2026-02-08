import {configureStore} from '@reduxjs/toolkit';
import authReducer from '@/store/authSlice';
import gameReducer from '@/store/gameSlice';
import {baseApi} from "@/services/api";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      game: gameReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];