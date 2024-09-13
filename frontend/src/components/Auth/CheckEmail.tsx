import {
  Box,
  Button,
  Typography,
  Container,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { resendVerificationEmail } from "../../apis/action";
import { RootState } from "../../stores/store";
import { useAppSelector } from "../../stores/storeHooks";

interface CheckEmailProps {
  open: boolean;
  onClose: () => void;
}

const userEmail = (state: RootState) => state.userType.email;

export default function CheckEmail({ open, onClose }: CheckEmailProps) {
  const navigate = useNavigate();
  const email = useAppSelector(userEmail);
  const [em, setEm] = useState("");

  useEffect(() => {
    if (email) {
      setEm(maskEmail(email));
    }
  }, [email]);

  function maskEmail(email: string) {
    const [localPart, domain] = email.split("@");
    const maskedLocalPart = `${localPart[0]}****`;
    const domainParts = domain.split(".");
    const maskedDomain = `${domainParts[0][0]}****${domainParts[0].slice(-1)}.${domainParts[1]}`;
    
    return `${maskedLocalPart}@${maskedDomain}`;
  }

  async function handleResendVerification() {
    try {
      const result = await resendVerificationEmail(email);
      return result;
    } catch (error) {
      console.error("Error resending verification email:", error);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          width: "800px",
          height: "600px",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          padding: "20px",
        },
      }}
    >
      <DialogContent sx={{ flex: 1 }}>
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              width: "100%",
              maxWidth: 400,
            }}
          >
            <Typography variant="h4" gutterBottom>
              Check your Email
            </Typography>
            <Typography variant="body1" gutterBottom>
              We have sent an email with password reset information to {em}
            </Typography>
            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{ marginTop: 5, borderRadius: "24px" }}
              onClick={handleResendVerification}
            >
              Resend
            </Button>
            <Button
              variant="outlined"
              fullWidth
              size="large"
              sx={{
                borderRadius: "24px",
                mt: 3,
                borderColor: "black",
              }}
              onClick={() => navigate('/login')}
            >
              Back to Login
            </Button>
          </Box>
        </Container>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
