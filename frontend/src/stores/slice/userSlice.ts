import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { UserInfos } from '../../apis/interfaces'
import { Axios, setAccesToken } from '../../apis/axiosConfig';

export interface userState {
    userInfos: UserInfos;
    isLoading: boolean;
}

const initialState: userState = {
    userInfos: {
        isVerified: false,
        id: "",
        token: "",
        role: "" ,
    },
    isLoading: false,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        initUser: (state, action: PayloadAction<UserInfos>) => {
            state.userInfos = action.payload;
        },

        setLogin: (state, action: PayloadAction<UserInfos>) => {
            state.userInfos = action.payload;
            setAccesToken(action.payload.token);
        },

        setLogout: (state) => {
            state.userInfos = initialState.userInfos;
            localStorage.removeItem("persist:root"); 
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        setUserRole: (state, action: PayloadAction<string>) => {
            state.userInfos.role = action.payload;
        },
    },
});

export async function userLogin(email: string, password: string): Promise<UserInfos | undefined> {
    const axiosInstance = Axios();

    try {
        const response = await Axios().post(`auth/login`, { email, password });
        console.log(response.data);
        const token = response.data.token;
        console.log("Token:", token);

        if (token) {
            setAccesToken(token);
        }

        console.log('Request Headers:', axiosInstance.defaults.headers);

        return response.data;
    } catch (error) {
        console.error("Login failed", error);
        return undefined;
    }
}

export const { initUser, setLogin, setLogout, setLoading, setUserRole } = userSlice.actions
export default userSlice.reducer
