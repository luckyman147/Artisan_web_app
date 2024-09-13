import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import userReducer from './slice/userSlice';
import userTypeReducer from './slice/userTypeSlice';
import listsReducer from "./slice/listsSlice";


// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'userType'],
};

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  userType: userTypeReducer,
  lists: listsReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer and serializableCheck option
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these actions for the serializability check
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;