import axios from 'axios';
import { refreshToken, setLogout } from '../stores/slice/userSlice'; 
import { store } from '../stores/store';

export const API_URL = import.meta.env.VITE_API_URL;

// Define default headers
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  Accept: 'application/json',
};

// Create Axios instance
export const Axios = () => {
  const AxiosInstance = axios.create({
    baseURL: API_URL,
    headers,
  });

  // Add a request interceptor
  AxiosInstance.interceptors.request.use(
    (config) => {
      const state = store.getState(); 
      const accessToken = state.user.userInfos.token; // Ensure you have the correct access token here
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`; 
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add a response interceptor
  AxiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const state = store.getState(); 
          const refreshTokenValue = state.user.userInfos.token; 

          if (!refreshTokenValue) {
            throw new Error('No refresh token available');
          }

          // Make sure to have a trailing slash for proper URL construction
          const response = await axios.post(`${API_URL}/auth/refresh-token`, { 
            token: refreshTokenValue,
          });

          const { accessToken } = response.data;
          store.dispatch(refreshToken(accessToken)); 

          // Update original request's Authorization header
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          // Retry the original request with the new access token
          return AxiosInstance(originalRequest); 
        } catch (refreshError) {
          console.error('Token refresh failed', refreshError);
          store.dispatch(setLogout()); 
          // Remove navigation logic from here
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error); 
    }
  );

  return AxiosInstance;
};

export const axiosWithCred = Axios();

export function setAccessToken(token: string) {
  axiosWithCred.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
