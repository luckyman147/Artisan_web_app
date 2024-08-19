  import { useState } from 'react';
  import { TextField, Button, Typography, Grid, Box, IconButton, InputAdornment } from '@mui/material';
  import { Visibility, VisibilityOff } from '@mui/icons-material';
  import { useNavigate, useParams } from 'react-router-dom';
  import { Link } from 'react-router-dom';
  import { resetPassword } from '../../apis/action';
  import { useForm, Controller } from 'react-hook-form';

  interface FormData {
    password: string;
    confirmPassword: string;
  }

  export default function ResetPassword() {
    const navigate = useNavigate();
    const { resetToken } = useParams<{ resetToken: string }>();
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const {
      control,
      handleSubmit,
    } = useForm<FormData>({
      defaultValues: {
        password: '',
        confirmPassword: '',
      },
    });

    const onSubmit = async (data: FormData) => {
      if (data.password !== data.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      if (!resetToken) {
        alert('Invalid reset token');
        return;
      }
      try {
        const response = await resetPassword(resetToken, data.password);
        if (response?.success) {
          navigate('/passwordresetSuccess');
        } else {
          alert(response?.message || 'Failed to reset password');
        }
      } catch (error) {
        console.error('Error resetting password:', error);
        alert('An unexpected error occurred. Please try again later.');
      }
    };

    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: '100vh' }}
      >
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 4,
              boxShadow: 3,
              borderRadius: 2,
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Reset Password
            </Typography>
            <Typography variant="body1" gutterBottom>
              Choose a new password for your account
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ marginBottom: 2 }}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Your new password"
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              onMouseDown={(event) => event.preventDefault()}
                            >
                              {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Box>
              <Box sx={{ marginBottom: 2 }}>
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Confirm your new password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle confirm password visibility"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              onMouseDown={(event) => event.preventDefault()}
                            >
                              {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2, borderRadius: "30px" }}
              >
                Reset Password
              </Button>
            </form>
            <Link to='/login' style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  mt: 2,
                  borderColor: "black",
                  color: "black",
                  fontWeight: "500",
                  borderRadius: "30px",
                }}
              >
                Back to Login
              </Button>
            </Link>
          </Box>
        </Grid>
      </Grid>
    );
  }
