import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Link,
  Grid,
  Box,
  IconButton,
  Divider,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FcGoogle } from "react-icons/fc";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useForm, Controller } from "react-hook-form";
import { useAppSelector } from "../../stores/storeHooks";
import { RootState } from "../../stores/store";
import { Register } from "../../apis/action";
import { UserRegister } from "../../apis/interfaces";
import { useNavigate } from "react-router-dom";
import back from "../../assets/images/blob-scene-haikei.svg";

export const Facebook02Icon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    {...props}
  >
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#0E88F0", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#097BEB", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path
      fill="url(#grad1)"
      stroke="url(#grad1)"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.18182 10.3333C5.20406 10.3333 5 10.5252 5 11.4444V13.1111C5 14.0304 5.20406 14.2222 6.18182 14.2222H8.54545V20.8889C8.54545 21.8081 8.74951 22 9.72727 22H12.0909C13.0687 22 13.2727 21.8081 13.2727 20.8889V14.2222H15.9267C16.6683 14.2222 16.8594 14.0867 17.0631 13.4164L17.5696 11.7497C17.9185 10.6014 17.7035 10.3333 16.4332 10.3333H13.2727V7.55556C13.2727 6.94191 13.8018 6.44444 14.4545 6.44444H17.8182C18.7959 6.44444 19 6.25259 19 5.33333V3.11111C19 2.19185 18.7959 2 17.8182 2H14.4545C11.191 2 8.54545 4.48731 8.54545 7.55556V10.3333H6.18182Z"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const userRole = (state: RootState) => state.userType.role;

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const { handleSubmit, control } = useForm<UserRegister>();
  const role = useAppSelector(userRole);
  const navigate = useNavigate();

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  async function onSubmit(data: UserRegister) {
    const phoneAsNumber = Number(phoneNumber.replace(/\D/g, ""));
    try {
      const result = await Register(
        data.firstname,
        data.lastname,
        data.email,
        data.password,
        phoneAsNumber,
        data.adress,
        data.company_name,
        role
      );

      if (result) {
        console.log("Registration successful:", result);
        navigate("/login");
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  }

  const handleFacebookLogin = () => {
    window.open(import.meta.env.VITE_AUTH_FACEBOOK, "_self");
  };

  const handleGoogleLogin = () => {
    window.open(import.meta.env.VITE_AUTH_GooGle, "_self");
  };
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      position={"relative"}
      style={{
        height: "100vh",
        width: "100%",
        backgroundImage: `url(${back})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <Grid item xs={12} md={6} lg={4}>
        <Box
          sx={{
            p: 4,
            position: "relative",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            textAlign: "center",
            maxWidth: "100%",
            margin: "0 auto",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            mt: 8,
            mb: 2,
            boxSizing: "border-box",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Create an Account
          </Typography>
          <Typography
            variant="body2"
            color="textPrimary"
            align="center"
            display="block"
            sx={{ fontFamily: "Poppins, sans-serif", mt: 1 }}
          >
            Already have an account?{" "}
            <Link href="/login" sx={{ fontWeight: "600" }}>
              Login
            </Link>
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={0.5} sx={{ width: "100%", mb: 1 }}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="firstname"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      label="First Name"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      color="primary"
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} paddingLeft={"60px"}>
                <Controller
                  name="lastname"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      label="Last Name"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      color="primary"
                      {...field}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Box sx={{ width: "100%", mb: 1 }}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    color="primary"
                    {...field}
                  />
                )}
              />
            </Box>
            <Box sx={{ width: "100%", mb: 1 }}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    country={"tn"}
                    value={phoneNumber}
                    onChange={(value) => setPhoneNumber(value)}
                    inputStyle={{
                      width: "100%",
                      height: "56px",
                      fontSize: "16px",
                      borderRadius: "4px",
                      borderColor: "#ced4da",
                      paddingLeft: "48px",
                    }}
                    buttonStyle={{ borderRadius: "4px 0 0 4px" }}
                  />
                )}
              />
            </Box>
            <Box sx={{ width: "100%", mb: 1 }}>
              <Controller
                name="adress"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    label="Address"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    color="primary"
                    {...field}
                  />
                )}
              />
            </Box>
            {role !== "Client" && (
              <Box sx={{ width: "100%", mb: 1 }}>
                <Controller
                  name="company_name"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      label="Company Name"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      color="primary"
                      {...field}
                    />
                  )}
                />
              </Box>
            )}
            <Box sx={{ width: "100%", mb: 2 }}>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    color="primary"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleShowPassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    {...field}
                  />
                )}
              />
            </Box>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Register
            </Button>
            {role !== "Artisan" && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  mt: 5,
                }}
              >
                <Divider sx={{ flexGrow: 1, borderColor: "text.secondary" }} />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mx: 2 }}
                >
                  Or sign Up with
                </Typography>
                <Divider sx={{ flexGrow: 1, borderColor: "text.secondary" }} />
              </Box>
            )}
            {role !== "Artisan" && (
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Button
                    variant="outlined"
                    startIcon={<Facebook02Icon />}
                    sx={{
                      borderColor: "#3b5998",
                      color: "#3b5998",
                      borderRadius: "50%",
                      height: 48,
                      width: 48,
                      minWidth: 0,
                      paddingLeft: 3,
                      backgroundColor: "#ffffff",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      svg: { fontSize: 24 },
                    }}
                    onClick={handleFacebookLogin}
                  />
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    startIcon={<FcGoogle />}
                    sx={{
                      borderColor: "#db4437",
                      color: "#db4437",
                      borderRadius: "50%",
                      height: 48,
                      width: 48,
                      minWidth: 0,
                      paddingLeft: 3,
                      backgroundColor: "#ffffff",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      svg: { fontSize: 24 },
                    }}
                    onClick={handleGoogleLogin}
                  />
                </Grid>
              </Grid>
            )}
          </form>
        </Box>
      </Grid>
    </Grid>
  );
}
