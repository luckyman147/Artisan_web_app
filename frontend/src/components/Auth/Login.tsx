import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  Grid,
  IconButton,
  Link,
  TextField,
  Typography,
  Box,
  FormControlLabel,
  Divider,
  InputAdornment,
  Dialog,
  DialogContent,
  DialogActions,
  Container,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FcGoogle } from "react-icons/fc";
import { Facebook02Icon } from "./RegisterForm";
import { useAppDispatch, useAppSelector } from "../../stores/storeHooks";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { setLogin, userLogin } from "../../stores/slice/userSlice";
import { CartProductResponse, UserConnectForm, UserInfos } from "../../apis/interfaces";
import ForgotPassword from "./ForgotPassword";
import UserTypeSelection from "./UserTypeSelection";
import { addCart, addWishList } from "../../apis/action";
import { AppDispatch, RootState } from "../../stores/store";
import { useDispatch } from "react-redux";

export default function Login() {
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [openUserType, setOpenUserType] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const wishlist = useAppSelector((state: RootState) => state.wish);
  const cart = useAppSelector((state: RootState) => state.cart);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserConnectForm>();

  const onSubmit = async (values: UserConnectForm) => {
    setError(null);
    setIsError(false);
  
    try {
      const data: UserInfos | undefined = await dispatch(userLogin(values.email, values.password));
  
      if (data) {
        dispatch(setLogin(data));
  
        if (data.id) {
          const cartProducts: CartProductResponse[] = cart.products.map(
            (product) => ({
              productId: product.productId,
              quantity: product.quantity || 1,
            })
          );
  
          if (cartProducts.length > 0) {
            await addCart(data.id, cartProducts);
          }
  
          if (wishlist.products.length > 0) {
            const wishProducts = wishlist.products.map((productId) => ({
              productId
            }));
            await addWishList(data.id, wishProducts);
          }
        }
  
        if (data.role === "user") {
          navigate("/products");
        } else if (data.role === "artisan") {
          navigate("/dashboard");
        } else if (data.role === "Admin") {
          navigate("/Admin_dashboard");
        }
      } else {
        setError("Username or password incorrect!");
        setIsError(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Please check your internet connection or try again.");
      setIsError(true);
    }
  };

  const handleSocialLogin = (provider: "facebook" | "google") => {
    const url = provider === "facebook" 
      ? process.env.VITE_AUTH_FACEBOOK 
      : process.env.VITE_AUTH_GOOGLE;
    window.open(url || "/", "_self");
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const id = urlParams.get("id");

    if (token && id) {
      dispatch(
        setLogin({
          token: token,
          id: id,
          isVerified: true,
          role: "user",
        })
      );
      navigate("/home");
    }
  }, [dispatch, navigate]);

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        py: 4,
        mt: 9, // Added 40px margin top (MUI spacing: 1 = 8px, so 5 = 40px)
      }}
    >
      <Paper elevation={3} sx={{ 
        p: { xs: 2, md: 4 },
        borderRadius: 3,
        background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)'
      }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            Welcome Back
          </Typography>
          <Typography color="text.secondary">
            Log in to your account to continue
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Email"
            type="email"
            {...register("email", { required: "Email is required" })}
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{ mb: 2, borderRadius: 2 }}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            {...register("password", { required: "Password is required" })}
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 1, borderRadius: 2 }}
          />

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                />
              }
              label="Remember me"
            />
            <Link
              onClick={() => setOpenForgotPassword(true)}
              variant="body2"
              color="primary"
              sx={{ fontWeight: 600, cursor: 'pointer' }}
            >
              Forgot password?
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: "bold",
              background: 'linear-gradient(45deg, #1976d2, #2196f3)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              mb: 2
            }}
          >
            Log In
          </Button>

          {isError && error && (
            <Typography color="error" align="center" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Divider sx={{ my: 3 }}>
            <Typography color="text.secondary">OR</Typography>
          </Divider>

          <Grid container spacing={2} justifyContent="center" mb={3}>
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

          <Typography textAlign="center" color="text.secondary">
            Don't have an account?{" "}
            <Link 
              onClick={() => setOpenUserType(true)} 
              color="primary" 
              fontWeight="bold"
              sx={{ cursor: 'pointer' }}
            >
              Sign up
            </Link>
          </Typography>
        </form>
      </Paper>

      <Dialog open={openForgotPassword} onClose={() => setOpenForgotPassword(false)}>
        <DialogContent>
          <ForgotPassword />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForgotPassword(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <UserTypeSelection open={openUserType} onClose={() => setOpenUserType(false)} />
    </Container>
  );
}