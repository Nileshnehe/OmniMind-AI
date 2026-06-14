import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authServices } from '../../features/auth/services/auth.service';

//  Async Thunk for Register Pipeline
export const registerUserThunk = createAsyncThunk(
  'auth/registerUser',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const data = await authServices.registerUser(username, email, password);
      return data; // Payload delivered on success
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Something went wrong during signup' });
    }
  }
);

//  Async Thunk for Login Pipeline
export const loginUserThunk = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authServices.loginUser(email, password);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Something went wrong during login' });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false, // Central synchronized loader hook
    error: null,
    registerSuccess: false, // Success modal toggle flag helper
  },
  reducers: {
    clearAuthErrors: (state) => {
      state.error = null;
    },
    resetRegisterStatus: (state) => {
      state.registerSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      /* ================= REGISTER UTILITY CASES ================= */
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registerSuccess = false;
      })
      .addCase(registerUserThunk.fulfilled, (state) => {
        state.loading = false;
        state.registerSuccess = true; // Opens up the custom registration success modal
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        // Express validator array checker logic
        if (action.payload?.errors && Array.isArray(action.payload.errors)) {
          state.error = action.payload.errors[0]?.msg;
        } else {
          state.error = action.payload?.message || 'Registration failed on server.';
        }
      })

      
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload?.user || null;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        // Express validator array checker logic
        if (action.payload?.errors && Array.isArray(action.payload.errors)) {
          state.error = action.payload.errors[0]?.msg;
        } else {
          state.error = action.payload?.message || 'Invalid email credentials or password.';
        }
      });
  },
});

export const { clearAuthErrors, resetRegisterStatus } = authSlice.actions;
export default authSlice.reducer;