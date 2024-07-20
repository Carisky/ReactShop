
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const checkStock = createAsyncThunk(
  'payment/checkStock',
  async (cartItems, { rejectWithValue }) => {
    try {
      const response = await axios.post('/Order/CheckStock', cartItems);
      return response.data; 
    } catch (error) {
      return rejectWithValue('Failed to check stock');
    }
  }
);

export const createOrder = createAsyncThunk(
  'payment/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/Order/CreateOrder', orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to create order');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    totalPrice: 0,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearPaymentState: (state) => {
      state.totalPrice = 0;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkStock.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkStock.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.totalPrice = action.payload.totalPrice; 
      })
      .addCase(checkStock.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createOrder.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
