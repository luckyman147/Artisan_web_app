import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
  Container,
  Paper,
  useTheme,
  useMediaQuery,
  styled
} from "@mui/material";
import { forgetPassword } from "../../apis/action";
import { motion } from "framer-motion";
import LockResetIcon from '@mui/icons-material/LockReset';

// Styled components
const AuthContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
}));

const AuthPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[10],
  width: '100%',
  maxWidth: '500px',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: theme.palette.primary.main,
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4),
  },
}));

const AuthButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: '50px',
  fontWeight: 600,
  letterSpacing: '0.5px',
  textTransform: 'none',
  fontSize: '1rem',
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await forgetPassword(email);
      if (response) {
        setSuccess(true);
      } else {
        setError("Failed to send password reset email. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please check your email and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthContainer maxWidth={false}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        <AuthPaper elevation={3}>
          <motion.div variants={slideUp}>
            <LockResetIcon 
              color="primary" 
              sx={{ 
                fontSize: 60, 
                mb: 2,
                background: theme.palette.primary.light,
                padding: theme.spacing(1.5),
                borderRadius: '50%'
              }} 
            />
            <Typography 
              variant={isMobile ? "h5" : "h4"} 
              fontWeight={700} 
              gutterBottom
              color="text.primary"
            >
              Reset Your Password
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              gutterBottom
              sx={{ mb: 4 }}
            >
              Enter your email address and we'll send you a link to reset your password.
            </Typography>
          </motion.div>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <motion.div variants={slideUp}>
              <TextField
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                required
                sx={{ mb: 3 }}
                InputProps={{
                  sx: {
                    borderRadius: '50px',
                    fieldset: {
                      borderColor: theme.palette.divider,
                    },
                  },
                }}
              />
            </motion.div>

            <motion.div
              variants={slideUp}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <AuthButton
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting}
                sx={{
                  mb: 2,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </AuthButton>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                Remember your password?{' '}
                <Button 
                  color="primary" 
                  href="/login"
                  sx={{ 
                    textTransform: 'none',
                    fontWeight: 600,
                    p: 0,
                    minWidth: 'auto'
                  }}
                >
                  Sign in here
                </Button>
              </Typography>
            </motion.div>
          </form>
        </AuthPaper>
      </motion.div>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSuccess(false)} 
          severity="success"
          sx={{ width: '100%' }}
          elevation={6}
        >
          Password reset link sent successfully! Please check your email.
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity="error"
          sx={{ width: '100%' }}
          elevation={6}
        >
          {error}
        </Alert>
      </Snackbar>
    </AuthContainer>
  );
}