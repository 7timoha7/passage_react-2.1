import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist/es/constants';
import storage from 'redux-persist/lib/storage';
import { usersReducer } from '../features/users/usersSlice';
import { categoriesReducer } from '../features/MenuCategories/menuCategoriesSlice';
import { productsReducer } from '../features/Products/productsSlise';
import { basketReducer } from '../features/Basket/basketSlice';

const usersPersistConfig = {
  key: 'passage:users',
  storage,
  whitelist: ['user'],
};

const rootReducer = combineReducers({
  users: persistReducer(usersPersistConfig, usersReducer),
  categories: persistReducer(usersPersistConfig, categoriesReducer),
  products: persistReducer(usersPersistConfig, productsReducer),
  basket: persistReducer(usersPersistConfig, basketReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
