import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserTypeState {
  role: any | null;
  email : any | null
}

const initialState: UserTypeState = {
  role: null,
  email : null
};

const userTypeSlice = createSlice({
  name: 'userType',
  initialState,
  reducers: {
    setUserRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
    },
    setUserEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
  },
});

export const { setUserRole,setUserEmail } = userTypeSlice.actions;
export default userTypeSlice.reducer;
