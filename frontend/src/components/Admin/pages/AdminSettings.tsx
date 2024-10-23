import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Avatar,
  Box,
  Divider,
  Snackbar,
  IconButton,
} from "@mui/material";
import { Edit, Save } from "@mui/icons-material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useAppSelector } from "../../../stores/storeHooks";
import { RootState } from "../../../stores/store";
import { editUser, getUserById } from "../../../apis/action";
import { UserInfo } from "../../../apis/interfaces";
import Layout from "../components/Layout";

const AdminSettings: React.FC = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const id = useAppSelector((state: RootState) => state.user.userInfos.id);
  const role = useAppSelector((state: RootState) => state.user.userInfos.role);

  const Usertoken = useAppSelector(
    (state: RootState) => state.user.userInfos.token
  );

  useEffect(() => {
    const fetchUser = async (id: string) => {
      const userData = await getUserById(id);
      if (userData) {
        setFirstname(userData.firstname);
        setLastname(userData.lastname);
        setEmail(userData.email);
        setPhone(userData.phone.toString());
        setAddress(userData.address);
        setCompanyName(userData.company_name);
        setShopDescription(userData.shopDescription || "");
        setAvatar(
          `${import.meta.env.VITE_API_IMAGE}${userData.avatar}` ||
            "https://via.placeholder.com/150"
        );
      }
    };

    if (id) {
      fetchUser(id);
    }
  }, [id, Usertoken]);

  const handleSave = async () => {
    setPasswordError(false);
    setIsSaving(true);

    if (password !== confirmPassword) {
      setPasswordError(true);
      setSnackbarMessage("Passwords do not match.");
      setSnackbarOpen(true);
      setIsSaving(false);
      return;
    }

    const phoneAsNumber = Number(phone.replace(/\D/g, ""));
    let updatedData: FormData | Partial<UserInfo> | undefined;

    const formData = new FormData();
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("phone", phoneAsNumber.toString());
    formData.append("address", address);
    formData.append("company_name", companyName);
    formData.append("shopDescription", shopDescription);
    if (password) {
      formData.append("password", password);
    }

    if (photo) {
      formData.append("avatar", photo);
    }

    updatedData = formData;

    if (updatedData) {
      const result = await editUser(id!, updatedData);
      if (result) {
        setSnackbarMessage("User information updated successfully.");
      } else {
        setSnackbarMessage("Error updating user information.");
      }
      setSnackbarOpen(true);
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const handlePhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsEditing(!isEditing);

    if (event.target.files && event.target.files[0]) {
      setPhoto(event.target.files[0]);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 12 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mt: 0  , mb :2}}>
                    {firstname} {lastname}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 0  , mb :2}}>
                   Email :  {email}
                  </Typography>
              
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Avatar
                    alt="User Profile"
                    src={photo ? URL.createObjectURL(photo) : avatar}
                    sx={{ width: 100, height: 100 }}
                  />
                  <Button
                    variant="contained"
                    component="label"
                    sx={{ mt: 2 }}
                    fullWidth
                  >
                    Upload Photo
                    <input type="file" hidden onChange={handlePhotoChange} />
                  </Button>
                </Box>
              
            </Grid>

            <Grid item xs={12} md={8}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" gutterBottom>
                  User Settings
                </Typography>
                <IconButton onClick={toggleEdit}>
                  {isEditing ? <Save color="primary" /> : <Edit />}
                </IconButton>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    variant="outlined"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    disabled={!isEditing}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    variant="outlined"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    disabled={!isEditing}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <PhoneInput
                    country={"tn"}
                    value={phone}
                    onChange={(phone) => setPhone(phone)}
                    disabled={!isEditing}
                    inputStyle={{
                      width: "100%",
                      height: "56px",
                      fontSize: "16px",
                      borderRadius: "4px",
                      borderColor: "#ced4da",
                      paddingLeft: "48px",
                    }}
                    placeholder="Phone Number"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Address"
                    variant="outlined"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={!isEditing}
                  />
                </Grid>

                {role === "artisan" && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Company Name"
                        variant="outlined"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        disabled={!isEditing}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Shop Description"
                        variant="outlined"
                        value={shopDescription}
                        onChange={(e) => setShopDescription(e.target.value)}
                        disabled={!isEditing}
                      />
                    </Grid>
                  </>
                )}

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={!isEditing}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    variant="outlined"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={passwordError}
                    disabled={!isEditing}
                  />
                </Grid>
              </Grid>

              {isEditing && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  sx={{ mt: 3 }}
                  fullWidth
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </Grid>
          </Grid>
        </Paper>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
        />
      </Container>
    </Layout>
  );
};

export default AdminSettings;
