import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminState {
  token: string | null;
  adminId: string | null;
  username: string | null;
}

const initialState: AdminState = {
  token: localStorage.getItem('adminToken') || null,
  adminId: localStorage.getItem('adminId') || null,
  username: localStorage.getItem('adminUsername') || null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdmin(state, action: PayloadAction<{ token: string; adminId: string; username: string }>) {
      state.token = action.payload.token;
      state.adminId = action.payload.adminId;
      state.username = action.payload.username;
      localStorage.setItem('adminToken', action.payload.token);
      localStorage.setItem('adminId', action.payload.adminId);
      localStorage.setItem('adminUsername', action.payload.username);
    },
    clearAdmin(state) {
      state.token = null;
      state.adminId = null;
      state.username = null;
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminId');
      localStorage.removeItem('adminUsername');
    },
  },
});

export const { setAdmin, clearAdmin } = adminSlice.actions;
export default adminSlice.reducer;
