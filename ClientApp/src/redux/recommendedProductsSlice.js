import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getTags = (state, limit = 3) => {
  const tags = state.recommendedProducts.tags;
  const sortedTags = Object.entries(tags).sort(
    ([, countA], [, countB]) => countB - countA
  );
  return sortedTags.slice(0, limit).map(([tag]) => tag);
};

export const fetchRecommendedProducts = createAsyncThunk(
  'recommendedProducts/fetchRecommendedProducts',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const tags = getTags(state);

    if (tags.length === 0) {
        
      return rejectWithValue('Tags are required.');
    }

    try {
      const response = await axios.post('/recommendedproducts', { tags });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || 'Failed to fetch recommended products.');
    }
  }
);

const recommendedProductsSlice = createSlice({
  name: 'recommendedProducts',
  initialState: {
    tags: {},
    recommendedProducts: [],
    status: 'idle',
    error: null
  },
  reducers: {
    incrementTag(state, action) {
      const tag = action.payload;
      if (state.tags[tag]) {
        if (state.tags[tag] !== 10) {
          state.tags[tag]++;
        }
      } else {
        state.tags[tag] = 1;
      }
    },
    resetTags(state) {
      state.tags = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendedProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRecommendedProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.recommendedProducts = action.payload;
      })
      .addCase(fetchRecommendedProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { incrementTag, resetTags } = recommendedProductsSlice.actions;
export default recommendedProductsSlice.reducer;
