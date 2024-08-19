import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserTypeState {
  role: any | null;
}

const initialState: UserTypeState = {
  role: null,
};

const userTypeSlice = createSlice({
  name: 'userType',
  initialState,
  reducers: {
    setUserRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
    },
  },
});

export const { setUserRole } = userTypeSlice.actions;
export default userTypeSlice.reducer;
