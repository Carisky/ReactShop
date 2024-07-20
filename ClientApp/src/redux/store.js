import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import cartReducer from './cartSlice';
import productsReducer from './productsSlice';
import recommendedProductsReducer from './recommendedProductsSlice';
import userReducer from './userSlice';


const rootReducer = combineReducers({
  cart: cartReducer,
  products: productsReducer,
  recommendedProducts: recommendedProductsReducer,
  user: userReducer,
});


const persistConfig = {
  key: 'root',
  storage,
};


const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
  reducer: persistedReducer,
});


const persistor = persistStore(store);

export { store, persistor };
