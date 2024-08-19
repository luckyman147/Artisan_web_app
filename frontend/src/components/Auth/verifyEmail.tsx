import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from "@mui/icons-material"; // Import icons
import { verifyEmail } from "../../apis/action";

export default function VerifyEmail() {
  const { token } = useParams<{ token: string }>();
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const verify = async () => {
        try {
          const result = await verifyEmail(token);
          if (result?.success) {
            setMessage("Email verified");
            setIsSuccess(true);
          } else {
            setMessage("Failed to verify email.");
            setIsSuccess(false);
          }
        } catch (error) {
          setMessage("An error occurred during verification.");
          setIsSuccess(false);
        }
      };

      verify();
    }
  }, [token]);

  return (
    <Container
      component="main"
      maxWidth="xs"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <Box mb={2}>
        {isSuccess ? (
          <CheckCircleIcon color="success" style={{ fontSize: 80 }} />
        ) : (
          <ErrorIcon color="error" style={{ fontSize: 80 }} />
        )}
      </Box>
      <Typography variant="h5" gutterBottom>
        {message}
      </Typography>
      {isSuccess && (
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "1rem" }}
          onClick={() => navigate("/login")}
        >
          Go to Login
        </Button>
      )}
    </Container>
  );
}
