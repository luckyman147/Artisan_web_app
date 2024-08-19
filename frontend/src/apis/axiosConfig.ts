import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL;




// type HeaderType = {
//   "Content-Type": string;
//   "Access-Control-Allow-Origin": string;
//   Accept: string;
// };

// let headers: HeaderType = {
//   "Content-Type": "application/json",
//   "Access-Control-Allow-Origin": "*",
//   Accept: "application/json",
// };

export const Axios = () => {
  return axios.create({
    baseURL: API_URL,
  });
};
// export const Axios = () => {
//   return axios.create({
//     baseURL: API_URL,
//     headers,
//   });
// };

export const axiosWithCred = axios.create({ baseURL: API_URL });
// export const axiosWithCred = axios.create({ baseURL: API_URL, headers });



export function setAccesToken(token: string) {
  axiosWithCred.defaults.headers["Authorization"] = `Bearer ${token}`;
}
