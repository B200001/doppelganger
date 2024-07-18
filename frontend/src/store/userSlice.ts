import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  currentUser: { token: string | null; email?: string; name?: string } | null;
  answers: any[];  // Add this line to handle user answers
}

const initialState: UserState = {
  currentUser: {
    token: localStorage.getItem('token'),
    email: localStorage.getItem('userEmail') || undefined,
    name: localStorage.getItem('userName') || undefined,
  },
  answers: []  // Initialize with an empty array
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ token: string; user?: { name: string; email: string } }>) {
      state.currentUser = { token: action.payload.token, ...action.payload.user };
      localStorage.setItem('token', action.payload.token);
      if (action.payload.user) {
        localStorage.setItem('userEmail', action.payload.user.email);
        localStorage.setItem('userName', action.payload.user.name);
      }
    },
    clearUser(state) {
      state.currentUser = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
    },
    setUserAnswers(state, action: PayloadAction<any[]>) {
      state.answers = action.payload;
    },
  },
});

export const { setUser, clearUser, setUserAnswers } = userSlice.actions; 
export default userSlice.reducer;
