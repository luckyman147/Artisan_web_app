import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { forgetPassword } from "../../apis/action";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await forgetPassword(email);
      if (response) {
        setSuccess(true);
        setError(null);

        // Optional: Redirect after success
        // setTimeout(() => navigate('/login'), 3000);
      } else {
        setError("Failed to send password reset email.");
        setSuccess(false);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setSuccess(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 4,
        maxWidth: 'sm',
        width: '100%',
        bgcolor: 'background.paper',
        boxShadow: 3,
        borderRadius: 2,
        margin: 'auto',
      }}
    >
      {/* Snackbar for success message */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          Password reset email sent successfully!
        </Alert>
      </Snackbar>

      {/* Snackbar for error message */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Typography variant="h4" fontWeight={900} gutterBottom>
        Forgot Password
      </Typography>
      <Typography variant="body1" gutterBottom>
        Enter the email you used to create your account so we can send you
        instructions on how to reset your password.
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mb: 2, borderRadius: 32 }}
        >
          Send
        </Button>
      </form>
    </Box>
  );
}
