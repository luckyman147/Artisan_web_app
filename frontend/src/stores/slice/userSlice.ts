import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { UserInfos } from '../../apis/interfaces'
import { Axios } from '../../apis/axiosConfig';

export interface userState {
    userInfos: UserInfos;
    isLoading: boolean;
}

const initialState: userState = {
    userInfos: {
        isVerified: false,
        idUser: 0,
        token: "",
        role: "" ,
        user : {}
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
        },

        setLogout: (state) => {
            state.userInfos = initialState.userInfos;
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
    try {
        const response = await Axios().post(`auth/login`, { email, password });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Login failed", error);
        return undefined;
    }
}

export const { initUser, setLogin, setLogout, setLoading, setUserRole } = userSlice.actions
export default userSlice.reducer
