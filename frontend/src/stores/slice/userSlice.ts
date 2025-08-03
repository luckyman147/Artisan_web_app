import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInfos } from '../../apis/interfaces';
import { Axios, axiosWithCred, setAccessToken } from '../../apis/axiosConfig';
import { AppDispatch } from '../store';

export interface userState {
  userInfos: UserInfos;
  isLoading: boolean;
}

const initialState: userState = {
  userInfos: {
    isVerified: false,
    id: '',
    token: '',
    role: '',
  },
  isLoading: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    initUser: (state, action: PayloadAction<UserInfos>) => {
      state.userInfos = action.payload;
    },

    setLogin: (state, action: PayloadAction<UserInfos>) => {
      state.userInfos = action.payload;
    },

    setLogout: (state) => {
      state.userInfos = initialState.userInfos;
      localStorage.removeItem('persist:root');
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setUserRole: (state, action: PayloadAction<string>) => {
      state.userInfos.role = action.payload;
    },

    refreshToken: (state, action: PayloadAction<string>) => {
      state.userInfos.token = action.payload;
    },
  },
});

// Function to handle user login
export const userLogin = (email: string, password: string) => async (dispatch: AppDispatch): Promise<UserInfos | undefined> => {
  dispatch(setLoading(true));
  try {
    const response = await Axios().post(`auth/login`, { email, password });
    const token = response.data.token;

    if (token) {
      setAccessToken(token); 
    }

    dispatch(setLogin(response.data)); 
    console.log(axiosWithCred.defaults.headers.common ,"cppùù");
    
    return response.data;
  } catch (error) {
    console.error('Login failed', error);
    return undefined;
  } finally {
    dispatch(setLoading(false));
  }
};

export const { initUser, setLogin, setLogout, setLoading, setUserRole, refreshToken } = userSlice.actions;
export default userSlice.reducer;
