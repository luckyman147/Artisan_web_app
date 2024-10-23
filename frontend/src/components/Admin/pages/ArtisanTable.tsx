import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Avatar,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Layout from "../components/Layout";
import { editAllUser, fetchAllArtisan } from "../../../apis/action";
import { ArtisanInfo, SelcteArtisanInfo } from "../../../apis/interfaces";
import PhoneInput from "react-phone-input-2";

const ArtisanTable: React.FC = () => {
  const [artisans, setArtisans] = useState<ArtisanInfo[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 5,
    page: 0,
  });
  const [selectedArtisan, setSelectedArtisan] = useState<SelcteArtisanInfo | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Form state
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  // Column definitions for the DataGrid
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "avatar",
      headerName: "Avatar",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Avatar
            alt={params.row.firstname}
            src={params.row.avatar}
            sx={{ width: 50, height: 50 }}
          />
        </Box>
      ),
    },
    { field: "firstname", headerName: "First Name", width: 150, sortable: true },
    { field: "lastname", headerName: "Last Name", width: 150, sortable: true },
    { field: "email", headerName: "Email", width: 200 },
    { field: "company_name", headerName: "Company Name", width: 200 },
    { field: "address", headerName: "Address", width: 200 },
    { field: "phone", headerName: "Phone", width: 150 },
    {
      field: "isVerified",
      headerName: "Verified",
      width: 100,
      sortable: true,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ color: params.row.isVerified ? "green" : "red", pt: 1 }}
        >
          {params.row.isVerified ? "Yes" : "No"}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleEdit(params.row)}
        >
          Edit
        </Button>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAllArtisan();
        if (response) {
          setArtisans(response);
        }
      } catch (error) {
        console.error("Error fetching artisans:", error);
      }
    };
    fetchData();
  }, [artisans]);

  const handleEdit = (artisan: SelcteArtisanInfo) => {
    setSelectedArtisan(artisan);
    setFirstname(artisan.firstname);
    setLastname(artisan.lastname);
    setPhone(artisan.phone);
    setAddress(artisan.address);
    setCompanyName(artisan.company_name);
    setShopDescription(artisan.shopDescription || "");
    setIsVerified(artisan.isVerified);
    setOpenModal(true);
  };

  const handleSave = async () => {
    setIsSaving(true);

    if (password !== confirmPassword) {
      setSnackbarMessage("Passwords do not match.");
      setSnackbarOpen(true);
      setIsSaving(false);
      return;
    }

    // Ensure phone is a string before processing
    const phoneAsNumber = Number(String(phone).replace(/\D/g, ""));

    const formData = new FormData();
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("phone", phoneAsNumber.toString());
    formData.append("address", address);
    formData.append("company_name", companyName);
    formData.append("shopDescription", shopDescription);
    formData.append("isVerified", isVerified ? "true" : "false");

    if (password) formData.append("password", password);
    if (photo) formData.append("avatar", photo);
console.log("iddd",selectedArtisan)
    try {
      const result = await editAllUser(selectedArtisan?.id!, formData);
      if (result) {
        setSnackbarMessage("User information updated successfully.");
      } else {
        setSnackbarMessage("Error updating user information.");
      }
    } catch (error) {
      console.error("Error saving user information:", error);
      setSnackbarMessage("Error updating user information.");
    } finally {
      setSnackbarOpen(true);
      setIsSaving(false);
      setOpenModal(false);
    }
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPhoto(event.target.files[0]);
    }
  };

  const rows = artisans.map((artisan) => ({
    id: artisan._id,
    avatar: `${import.meta.env.VITE_API_IMAGE}${artisan.avatar}`,
    firstname: artisan.firstname,
    lastname: artisan.lastname,
    email: artisan.email,
    company_name: artisan.company_name,
    address: artisan.address,
    phone: artisan.phone,
    isVerified: artisan.isVerified,
  }));

  return (
    <Layout>
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          marginBottom: 3,
          fontWeight: "bold",
          color: "primary.main",
        }}
      >
        Artisan Table
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexGrow: 1,
          padding: 2,
        }}
      >
        <Box sx={{ height: 600, width: "90%", maxWidth: "90%", padding: 3 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25]}
            pagination
            disableRowSelectionOnClick
          />
        </Box>
      </Box>

      {/* Edit Modal */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            textAlign: "center",
          }}
        >
          Edit Artisan
        </DialogTitle>
        <DialogContent sx={{ padding: 4 }}>
          <TextField
            label="First Name"
            fullWidth
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Last Name"
            fullWidth
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
          />
          <PhoneInput
            country={"tn"}
            value={phone}
            onChange={(value) => {
              setPhone(value);
            }}
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

          <TextField
            label="Address"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Company Name"
            fullWidth
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Shop Description"
            fullWidth
            value={shopDescription}
            onChange={(e) => setShopDescription(e.target.value)}
            multiline
            rows={4}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <input
            type="file"
            onChange={handlePhotoChange}
            accept="image/*"
            style={{ marginBottom: "16px" }}
          />
          <FormControl fullWidth>
            <InputLabel id="isVerified-label">Verified</InputLabel>
            <Select
              labelId="isVerified-label"
              value={isVerified ? "true" : "false"}
              onChange={(e) => setIsVerified(e.target.value === "true")}
            >
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        autoHideDuration={3000}
      />
    </Layout>
  );
};

export default ArtisanTable;
