import { useEffect, useState } from "react";
import { fetchAllArtisan } from "../../apis/action";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Pagination,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { ArtisanInfo } from "../../apis/interfaces";
import Layout from "../layout/Layout";
import CustomBreadcrumbs from "../layout/Breadcrumbs";

const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Artisan" }];
const ITEMS_PER_PAGE = 6; 

export default function ArtisanList() {
  const [artisans, setArtisans] = useState<ArtisanInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1); 

  useEffect(() => {
    const fetchArtisans = async () => {
      const data = await fetchAllArtisan();
      if (data) {
        setArtisans(data);
      }
    };
    fetchArtisans();
  }, []);

  const filteredArtisans = artisans.filter((artisan) =>
    `${artisan.firstname} ${artisan.lastname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Calculate the number of pages
  const totalPages = Math.ceil(filteredArtisans.length / ITEMS_PER_PAGE);

  // Get the artisans to display for the current page
  const paginatedArtisans = filteredArtisans.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (
    _: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value); 
  };

  return (
    <Layout>
      <CustomBreadcrumbs items={breadcrumbItems} />

      <Box
        sx={{
          mt: 3,
          padding: "10px 0",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Search Bar with Search Icon */}
        <TextField
          label="Search Artisan"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ marginBottom: "20px", width: "50%" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        {/* Artisans Card Section */}
        <Typography
          variant="h5"
          gutterBottom
          textAlign="center"
          sx={{ width: "100%" }}
        >
          Artisans of the Month
        </Typography>

        <Box
          sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}
        >
          {paginatedArtisans.length > 0 ? (
            paginatedArtisans.map((artisan) => (
              <Link
                key={artisan._id}
                to={`/artisan/profile/${artisan._id}`}
                style={{ textDecoration: "none" }}
              >
                <Paper
                  sx={{
                    padding: "20px",
                    margin: "10px",
                    width: "250px",
                    height: "300px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "box-shadow 0.3s ease, transform 0.3s ease",
                    "&:hover": {
                      boxShadow: "0px 8px 12px rgba(19, 119, 250, 0.2)",
                      cursor: "pointer",
                    },
                  }}
                >
                  <Box
                    height={150}
                    width={150}
                    bgcolor="#E0E0E0"
                    mb={2}
                    borderRadius="50%"
                    mx="auto"
                    component="img"
                    src={`${import.meta.env.VITE_API_IMAGE}${artisan.avatar}`}
                  />
                  <Typography variant="h6" textAlign="center">
                    {`${artisan.firstname} ${artisan.lastname}`}
                  </Typography>
                </Paper>
              </Link>
            ))
          ) : (
            <Typography variant="body1" textAlign="center">
              No artisans found
            </Typography>
          )}
        </Box>
      </Box>

      {/* Pagination */}
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        sx={{
          mt: 20,
          display: "flex",
          justifyContent: "center",
          mb: 3,
        }}
      />
    </Layout>
  );
}
