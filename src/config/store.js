import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import dataReducer from '../reducers/dataReducer';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';


const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['salesToday']
}

const persistedReducer = persistReducer(persistConfig, dataReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
      serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
  }),
});

export const persistor = persistStore(store)