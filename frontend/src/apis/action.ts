import { Axios, axiosWithCred } from "./axiosConfig";
import { ResetPasswordResponse, response, UserRegister } from "./interfaces";

export async function Register(
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  phone: number,
  adress: string,
  company_name: string,
  role: string
): Promise<UserRegister | undefined> {
  try {
    // Send the user data as part of the request body
    const { data }: { data: UserRegister } = await axiosWithCred.post(
      "/auth/register",
      {
        firstname,
        lastname,
        email,
        password,
        phone,
        adress,
        company_name,
        role,
      }
    );

    // Return the response data
    return data;
  } catch (error) {
    console.error("Error registering user:", error);
    // Return undefined in case of error
    return undefined;
  }
}

export async function verifyEmail(
  token: string
): Promise<response | undefined> {
  try {
    const { data }: { data: response } = await axiosWithCred.get(
      `/auth/verify/${token}`
    );
    return data;
  } catch (error) {
    console.error("Error verifying email:", error);
    // Return undefined in case of error
    return undefined;
  }
}

export async function forgetPassword(email: string): Promise<Response | undefined> {
    try {
      const { data }: { data: Response } = await axiosWithCred.post(
        '/auth/forgotpassword',
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      return data;
    } catch (error) {
      console.error('Error verifying email:', error);
      return undefined;
    }
  }


  export async function resetPassword(resetToken: string, password: string): Promise<ResetPasswordResponse | undefined> {
    try {
      const { data } = await Axios().put<ResetPasswordResponse>(
        `/auth/resetpassword/${resetToken}`, 
        { password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      return data;
    } catch (error) {
      console.error('Error resetting password:', error); 
    }
}
  

export async function AuthGoogel(
): Promise<response | undefined> {
  try {
    const { data }: { data: response } = await axiosWithCred.get(
      `/google/callback`
    );
    return data;
  } catch (error) {
    console.error("Error verifying email:", error);
    // Return undefined in case of error
    return undefined;
  }
}