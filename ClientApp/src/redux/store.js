import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import cartReducer from './cartSlice';
import productsReducer from './productsSlice';
import recommendedProductsReducer from './recommendedProductsSlice';
import userReducer from './userSlice';

// Combine reducers
const rootReducer = combineReducers({
  cart: cartReducer,
  products: productsReducer,
  recommendedProducts: recommendedProductsReducer,
  user: userReducer,
});

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
const store = configureStore({
  reducer: persistedReducer,
});

// Create a persistor
const persistor = persistStore(store);

export { store, persistor };
