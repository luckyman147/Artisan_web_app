export interface UserInfos {
  isVerified: boolean;
  idUser: number;
  token: string;
  role: string;
  user :any
}

export interface UserRegister {
  firstname: string;
  lastname: string;
  password: string;
  role: string;
  email: string;
  phone: number;
  adress: string;
  company_name: string;
}

export interface UserConnectForm {
  email: string;
  password: string;
}

export interface response {
  success: boolean;
  message: string;
 
}

export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
  error?: string;
}