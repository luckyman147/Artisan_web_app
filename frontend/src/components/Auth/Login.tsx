import { useEffect, useState } from "react";
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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FcGoogle } from "react-icons/fc";
import { Facebook02Icon } from "./RegisterForm";
import { useAppDispatch } from "../../stores/storeHooks";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { setLogin, userLogin } from "../../stores/slice/userSlice";
import { UserConnectForm } from "../../apis/interfaces";
import back from "../../assets/images/blob-scene-haikei login.svg";
import ForgotPassword from "./ForgotPassword";
import UserTypeSelection from "./UserTypeSelection";

export default function Login() {
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [openUserType, setOpenUserType] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserConnectForm>();

  const [error, setError] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  const onSubmit = async (values: UserConnectForm) => {
    setError(null);
    setIsError(false);

    try {
      const data = await userLogin(values.email, values.password);

      if (data) {
        dispatch(setLogin(data));
        console.log(data,"loginnnn");        
        if(data.role === "user"){
           navigate("/products");
        }else if(data.role === "artisan"){
           navigate("/dashboard");
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

  const handleFacebookLogin = () => {
    window.open(import.meta.env.VITE_AUTH_FACEBOOK, "_self");
  };

  const handleGoogleLogin = () => {
    window.open(import.meta.env.VITE_AUTH_GooGle, "_self");
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const id = urlParams.get('id');

    if (token && id) {
      dispatch(setLogin({
        token: token,
        id: id,
        isVerified: true,
        role: "user",
      }));
      navigate('/home')
    }
  }, [dispatch]);


  const handleOpenForgotPassword = () => setOpenForgotPassword(true);
  const handleCloseForgotPassword = () => setOpenForgotPassword(false);

  const handleOpenUserType = () => setOpenUserType(true);
  const handleCloseUserType = () => setOpenUserType(false);

  return (
    <Grid
      position={"relative"}
      container
      justifyContent="center"
      alignItems="center"
      style={{
        height: "100vh",
        width: "100%",
        backgroundImage: `url(${back})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <Grid item xs={12} md={4}>
        <Box
          sx={{
            p: 4,
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e0e0e0",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{ fontFamily: "Poppins, sans-serif" }}
          >
            Log in
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ width: "100%", mb: 2 }}>
              <TextField
                label="Email"
                type="email"
                {...register("email", { required: "Email is required" })}
                fullWidth
                margin="normal"
                variant="outlined"
                color="primary"
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
              />
            </Box>
            <Box sx={{ width: "100%", mb: 2 }}>
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Password is required" })}
                fullWidth
                margin="normal"
                variant="outlined"
                color="primary"
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ""}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography
                variant="caption"
                color="textSecondary"
                gutterBottom
                align="left"
                sx={{ display: "block", mt: 0 }}
              >
                Use 8 or more characters with a mix of letters, numbers &
                symbols
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              }
              label="Remember me"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, borderRadius: 32 }}
            >
              Log in
            </Button>
            {isError && error && (
              <Typography
                variant="body2"
                color="error"
                align="center"
                sx={{ mt: 2 }}
              >
                {error}
              </Typography>
            )}
            <Link
              onClick={handleOpenForgotPassword}
              variant="body2"
              color="textPrimary"
              align="center"
              display="block"
              mt={2}
              sx={{ fontWeight: "600", fontFamily: "Poppins, sans-serif", cursor: 'pointer' }}
            >
              Forget your password?
            </Link>
            <Typography
              variant="body2"
              color="textPrimary"
              align="center"
              display="block"
              sx={{ fontFamily: "Poppins, sans-serif", mt: 1 }}
            >
              Don't have an account?{" "}
              <Link onClick={handleOpenUserType} sx={{ fontWeight: "600", cursor: 'pointer' }}>
                Sign up
              </Link>
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2, mt: 3 }}>
              <Divider sx={{ flexGrow: 1, borderColor: "text.secondary" }} />
              <Typography variant="body2" color="textSecondary" sx={{ mx: 2 }}>
                Or sign in with
              </Typography>
              <Divider sx={{ flexGrow: 1, borderColor: "text.secondary" }} />
            </Box>
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
          </form>
        </Box>
      </Grid>

      {/* Forgot Password Dialog */}
      <Dialog
        open={openForgotPassword}
        onClose={handleCloseForgotPassword}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <ForgotPassword />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForgotPassword} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Type Selection Dialog */}
      <UserTypeSelection open={openUserType} onClose={handleCloseUserType} />
    </Grid>
  );
}


