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
  Container,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FcGoogle } from "react-icons/fc";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../stores/storeHooks";
import { RootState } from "../../stores/store";
import { setUserEmail } from "../../stores/slice/userTypeSlice";
import CheckEmail from "./CheckEmail";

// Facebook Icon Component

export const Facebook02Icon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
  >
    <rect width="24" height="24" fill="white" />
    <path
      fill="#1877F2"
      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
    />
  </svg>
);

interface UserRegister {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  company_name?: string;
}

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserRegister>();
  
  const role = useAppSelector((state: RootState) => state.userType.role);
  const dispatch = useAppDispatch();

  const onSubmit = async (data: UserRegister) => {
    setIsSubmitting(true);
    try {
      const phoneAsNumber = Number(phoneNumber.replace(/\D/g, ""));
      // Replace with your actual API call
      const result = await new Promise<boolean>((resolve) => 
        setTimeout(() => resolve(true), 1000)
      );
      
      if (result) {
        dispatch(setUserEmail(data.email));
        setIsDialogOpen(true);
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider: "facebook" | "google") => {
    const url = provider === "facebook" 
      ? process.env.VITE_AUTH_FACEBOOK 
      : process.env.VITE_AUTH_GOOGLE;
    window.open(url || "/", "_self");
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ 
        p: { xs: 2, md: 4 },
        borderRadius: 3,
        background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)'
      }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            Create an Account
          </Typography>
          <Typography color="text.secondary">
            {role === "artisan" 
              ? "Join our artisan community" 
              : "Get started with your account"}
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="firstname"
                control={control}
                defaultValue=""
                rules={{ required: "First name is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    fullWidth
                    margin="normal"
                    error={!!errors.firstname}
                    helperText={errors.firstname?.message}
                    sx={{ borderRadius: 2 }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="lastname"
                control={control}
                defaultValue=""
                rules={{ required: "Last name is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Name"
                    fullWidth
                    margin="normal"
                    error={!!errors.lastname}
                    helperText={errors.lastname?.message}
                    sx={{ borderRadius: 2 }}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Please enter a valid email",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{ borderRadius: 2 }}
              />
            )}
          />

          <Box mt={2} mb={1}>
            <Controller
              name="phone"
              control={control}
              rules={{
                required: "Phone is required",
                pattern: {
                  value: /^\d{11}$/,
                  message: "Must be 11 digits",
                },
              }}
              render={({ field }) => (
                <>
                  <PhoneInput
                    country="tn"
                    value={phoneNumber}
                    onChange={(value) => {
                      field.onChange(value);
                      setPhoneNumber(value);
                    }}
                    inputStyle={{
                      width: "100%",
                      height: "56px",
                      borderRadius: "8px",
                      borderColor: errors.phone ? "#d32f2f" : "rgba(0, 0, 0, 0.23)",
                    }}
                  />
                  {errors.phone && (
                    <Typography color="error" variant="caption">
                      {errors.phone.message}
                    </Typography>
                  )}
                </>
              )}
            />
          </Box>

          <Controller
            name="address"
            control={control}
            defaultValue=""
            rules={{ required: "Address is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Address"
                fullWidth
                margin="normal"
                error={!!errors.address}
                helperText={errors.address?.message}
                sx={{ borderRadius: 2 }}
              />
            )}
          />

          {role !== "user" && (
            <Controller
              name="company_name"
              control={control}
              defaultValue=""
              rules={{ required: "Company name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Company Name"
                  fullWidth
                  margin="normal"
                  error={!!errors.company_name}
                  helperText={errors.company_name?.message}
                  sx={{ borderRadius: 2 }}
                />
              )}
            />
          )}

          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Minimum 8 characters",
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message: "Requires uppercase, lowercase, number, and special character",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ borderRadius: 2 }}
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={isSubmitting}
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: "bold",
              background: 'linear-gradient(45deg, #1976d2, #2196f3)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </Button>

          {role !== "artisan" && (
            <>
              <Divider sx={{ my: 3 }}>
                <Typography color="text.secondary">OR</Typography>
              </Divider>

              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <IconButton
                    onClick={() => handleSocialLogin("facebook")}
                    sx={{
                      bgcolor: "#1877F2",
                      color: "white",
                      "&:hover": { bgcolor: "#166FE5" },
                      width: 48,
                      height: 48
                    }}
                  >
                    <Facebook02Icon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton
                    onClick={() => handleSocialLogin("google")}
                    sx={{
                      bgcolor: "white",
                      border: "1px solid #e0e0e0",
                      "&:hover": { bgcolor: "#f5f5f5" },
                      width: 48,
                      height: 48
                    }}
                  >
                    <FcGoogle size={24} />
                  </IconButton>
                </Grid>
              </Grid>
            </>
          )}

          <Typography textAlign="center" mt={3} color="text.secondary">
            Already have an account?{" "}
            <Link href="/login" fontWeight="bold" color="primary">
              Login
            </Link>
          </Typography>
        </form>
      </Paper>

      <CheckEmail 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
      />
    </Container>
  );
};

export default RegisterForm;