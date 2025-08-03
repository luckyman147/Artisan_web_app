import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import {
  Box,
  Avatar,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  fetchAllUser,
  fetchAllArtisan,
  fetchAllAdmin,
} from "../../../apis/action";
import { AdminInfo, ArtisanInfo, UsersInfo } from "../../../apis/interfaces";
import { RootState } from "../../../stores/store";
import { useAppSelector } from "../../../stores/storeHooks";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import Charts from "../pages/Charts";

export default function Dashboard() {
  const [adminInfo, setAdminInfo] = useState<AdminInfo[]>([]);

  useEffect(() => {
    const getAdminInfo = async () => {
      const fetchedAdminInfo = await fetchAllAdmin();
      if (fetchedAdminInfo) {
        setAdminInfo(fetchedAdminInfo);
      }
    };

    getAdminInfo();
  }, []);

  return (
    <Layout>
      {/* Container for Grid */}
      <Grid container spacing={2} sx={{ padding: { xs: 1, md: 3 }, mt: 4 }}>
        {/* Admin Info Cards */}
        {adminInfo.map((admin, index) => (
          <Grid item xs={12} sm={6} md={4} ml={6} key={index}>
            <Card sx={{ display: "flex", alignItems: "center", padding: 1 }}>
              <Box sx={{ marginRight: 2, display: "flex", alignItems: "center" }}>
                <Avatar
                  alt={admin.firstname}
                  src={admin.avatar}
                  sx={{ width: 56, height: 56 }}
                />
              </Box>

              <CardContent sx={{ flex: "1" }}>
                <Typography variant="h6" component="div">
                  Admin Info
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {`${admin.firstname} ${admin.lastname}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {admin.email}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Chart Section */}
        <Grid item xs={12}>
          <Charts />
        </Grid>

        {/* User Table on the left */}
        <Grid item xs={12} md={6}>
          <UserTable />
        </Grid>

        {/* Artisan Table on the right */}
        <Grid item xs={12} md={6}>
          <ArtisanTable />
        </Grid>
      </Grid>
    </Layout>
  );
}

// Column definitions for the DataGrid (Users Table)
const userColumns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "firstname", headerName: "First Name", width: 150, sortable: true },
  { field: "lastname", headerName: "Last Name", width: 150, sortable: true },
  { field: "email", headerName: "Email", width: 200 },
  { field: "phone", headerName: "Phone", width: 150 },
  { field: "role", headerName: "Role", width: 130 },
  { field: "company_name", headerName: "Company Name", width: 200 },
  {
    field: "isVerified",
    headerName: "Verified",
    width: 100,
    sortable: true,
    renderCell: (params) => (
      <Typography
        variant="body2"
        sx={{ color: params.row.isVerified ? "green" : "red" }}
      >
        {params.row.isVerified ? "Yes" : "No"}
      </Typography>
    ),
  },
];

export const UserTable: React.FC = () => {
  const [users, setUsers] = useState<UsersInfo[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 5,
    page: 0,
  });
  const [loading, setLoading] = useState(true);
  const id = useAppSelector((state: RootState) => state.user.userInfos.id);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate("/login");
    }

    const fetchData = async () => {
      try {
        const response = await fetchAllUser();
        if (response) {
          setUsers(response);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const rows = users.map((user) => ({
    id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phone: user.phone,
    role: user.role,
    company_name: user.company_name,
    isVerified: user.isVerified,
  }));

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ height: 400, width: "90%",ml:6 }}>
      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
          marginBottom: 2,
          fontWeight: "bold",
          color: "primary.main",
        }}
      >
        User Table
      </Typography>
      <DataGrid
        rows={rows}
        columns={userColumns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 25]}
        pagination
        disableRowSelectionOnClick
        sx={{
          "& .MuiDataGrid-cell": {
            wordBreak: "break-word", 
          },
        }}
      />
    </Box>
  );
};

// Column definitions for the DataGrid (Artisans Table)
const artisanColumns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70},
  {
    field: "avatar",
    headerName: "Avatar",
    width: 100,
    sortable: false,
    renderCell: (params) => (
      <Avatar
        alt={params.row.firstname}
        src={params.row.avatar}
        sx={{ width: 40, height: 40 }}
      />
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
];

export const ArtisanTable: React.FC = () => {
  const [artisans, setArtisans] = useState<ArtisanInfo[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 5,
    page: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAllArtisan();
        if (response) {
          setArtisans(response);
        }
      } catch (error) {
        console.error("Error fetching artisans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const rows = artisans.map((artisan) => ({
    id: artisan._id,
    avatar: artisan.avatar,
    firstname: artisan.firstname,
    lastname: artisan.lastname,
    email: artisan.email,
    phone: artisan.phone,
    company_name: artisan.company_name,
    address: artisan.address,
    isVerified: artisan.isVerified,
  }));

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ height: 400, width: "90%",ml : 6 }}>
      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
          marginBottom: 2,
          fontWeight: "bold",
          color: "primary.main",
        }}
      >
        Artisan Table
      </Typography>
      <DataGrid
        rows={rows}
        columns={artisanColumns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 25]}
        pagination
        disableRowSelectionOnClick
        sx={{
          "& .MuiDataGrid-cell": {
            wordBreak: "break-word", 
          },
        }}
      />
    </Box>
  );
};
