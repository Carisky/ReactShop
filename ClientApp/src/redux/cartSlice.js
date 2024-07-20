

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchProductDetails = createAsyncThunk(
  'cart/fetchProductDetails',
  async (productIds, { rejectWithValue }) => {
    try {
      const response = await axios.post('/products/ids', productIds);
      return response.data; 
    } catch (error) {
      return rejectWithValue('Failed to fetch product details');
    }
  }
);


export const updateCartWithDetails = createAsyncThunk(
  'cart/updateCartWithDetails',
  async (_, { getState, dispatch }) => {
    const cartItems = getState().cart.items;
    const productIds = cartItems.map(item => item.productId);

    
    const products = await dispatch(fetchProductDetails(productIds)).unwrap();
    
    
    const productMap = products.reduce((map, product) => {
      map[product.id] = product;
      return map;
    }, {});

    return {
      items: cartItems.map(item => ({
        ...item,
        product: productMap[item.productId] || item.product,
      })),
    };
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addItem: (state, action) => {
      const { productId, quantity, product } = action.payload;
      const existingItem = state.items.find(item => item.productId === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ productId, quantity, product });
      }
    },
    updateItemQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.productId === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
    removeItem: (state, action) => {
      const { productId } = action.payload;
      state.items = state.items.filter(item => item.productId !== productId);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateCartWithDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCartWithDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
      })
      .addCase(updateCartWithDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { addItem, updateItemQuantity, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
