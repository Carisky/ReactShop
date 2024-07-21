import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await axios.get('/products');
  return response.data;
});

export const fetchProductDetails = createAsyncThunk('products/fetchProductDetails', async (productId) => {
  const response = await axios.get(`/products/${productId}`);
  return response.data;
});

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    filteredProducts: [],
    productDetails: {},
    status: 'idle',
    error: null,
    selectedTags: [],
    priceRange: [0, 1000], // Default price range, adjust as needed
  },
  reducers: {
    toggleTag(state, action) {
      const tag = action.payload;
      if (state.selectedTags.includes(tag)) {
        state.selectedTags = state.selectedTags.filter(t => t !== tag);
      } else {
        state.selectedTags.push(tag);
      }
      state.filteredProducts = filterProducts(state.products, state.selectedTags, state.priceRange);
    },
    setPriceRange(state, action) {
      state.priceRange = action.payload;
      state.filteredProducts = filterProducts(state.products, state.selectedTags, state.priceRange);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
        state.filteredProducts = filterProducts(action.payload, state.selectedTags, state.priceRange);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.productDetails[action.payload.id] = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

function filterProducts(products, selectedTags, priceRange) {
  return products.filter(product => {
    const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => product.tags.includes(tag));
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesTags && matchesPrice;
  });
}

export const { toggleTag, setPriceRange } = productsSlice.actions;

export default productsSlice.reducer;
