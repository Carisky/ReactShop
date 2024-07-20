import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  isAdmin: false,
  isExpired: false
};

// Helper functions
const parseJwt = (token) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
};

const validateToken = (token) => {
  const decodedToken = parseJwt(token);
  const currentTime = Math.floor(Date.now() / 1000);
  return decodedToken.exp > currentTime;
};

const isAdmin = (token) => {
  const decodedToken = parseJwt(token);
  return decodedToken.role === "Admin";
};

// Async Thunks
export const validateAdmin = createAsyncThunk('user/validateAdmin', async (token) => {
  let options = {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  };
  const response = await fetch("/admin/validation/", options);
  return response.ok;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      const token = action.payload;
      state.token = token;
      state.isAdmin = isAdmin(token);
      state.isExpired = !validateToken(token);
    },
    clearUser(state) {
      state.token = null;
      state.isAdmin = false;
      state.isExpired = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateAdmin.fulfilled, (state, action) => {
        state.isAdmin = action.payload;
      });
  }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
