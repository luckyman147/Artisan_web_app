import {
  Box,
  Divider,
  FormControlLabel,
  Checkbox,
  List,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Slider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { getAllcategories, getArtisanById } from "../../apis/action";
import { useAppSelector } from "../../stores/storeHooks";
import { RootState } from "../../stores/store";
import { Product, ArtisanInfo, Category } from "../../apis/interfaces";

interface SidebarProps {
  onFilterChange: (filters: {
    search: string;
    priceRange: [number, number];
    stockRange: [number, number];
    categories: string[];
    artisans: string[];
  }) => void;
}

export default function Sidebar({ onFilterChange }: SidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [artisans, setArtisans] = useState<ArtisanInfo[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [stockRange, setStockRange] = useState<[number, number]>([0, 100]);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedArtisans, setSelectedArtisans] = useState<Set<string>>(new Set());

  const id = useAppSelector((state: RootState) => state.user.userInfos.id);
  const token = useAppSelector((state: RootState) => state.user.userInfos.token);

  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await getAllcategories();
        if (response) setCategories(response);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    }

    async function fetchArtisan() {
      try {
        const response = await getArtisanById(id!, token);
        if (response) setArtisans(response);
      } catch (err) {
        console.error("Failed to fetch artisans", err);
      }
    }

    fetchCategory();
    fetchArtisan();
  }, [id, token]);

  // Handle search text change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    applyFilters({ search: value });
  };

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const updatedCategories = new Set(selectedCategories);
    if (checked) {
      updatedCategories.add(name);
    } else {
      updatedCategories.delete(name);
    }
    setSelectedCategories(updatedCategories);
    applyFilters({ categories: Array.from(updatedCategories) });
  };

  // Handle artisan change
  const handleArtisanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const updatedArtisans = new Set(selectedArtisans);
    if (checked) {
      updatedArtisans.add(name);
    } else {
      updatedArtisans.delete(name);
    }
    setSelectedArtisans(updatedArtisans);
    applyFilters({ artisans: Array.from(updatedArtisans) });
  };

  // Handle stock change
  const handleStockChange = (e: Event, value: number | number[]) => {
    setStockRange(value as [number, number]);
    applyFilters({ stockRange: value as [number, number] });
  };

  // Handle price change
  const handlePriceChange = (e: Event, value: number | number[]) => {
    setPriceRange(value as [number, number]);
    applyFilters({ priceRange: value as [number, number] });
  };

  // Function to apply filters and pass them up to parent
  const applyFilters = (updatedFilter: Partial<any>) => {
    onFilterChange({
      search: searchText,
      priceRange,
      stockRange,
      categories: Array.from(selectedCategories),
      artisans: Array.from(selectedArtisans),
      ...updatedFilter,
    });
  };

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: "#f9f9f9",
        borderRadius: 2,
        boxShadow: 1,
        width: { xs: "100%", sm: 250, xl: "70%" },
        height: { xs: "auto", sm: "calc(100vh - 64px)", xl: "100%" },
        overflowY: "auto",
        marginTop: "5px",
      }}
    >
      {/* Search Field */}
      <TextField
        label="Search our store"
        variant="outlined"
        fullWidth
        value={searchText}
        onChange={handleSearchChange}
        sx={{
          mb: 2,
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Filter by Stock */}
      <Typography variant="h6" sx={{ mb: 1, color: "text.primary" }}>
        Filter by Stock
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Slider
        value={stockRange}
        onChange={handleStockChange}
        valueLabelDisplay="auto"
        min={0}
        max={100}
        sx={{ mb: 2 }}
      />

      {/* Filter by Price */}
      <Typography variant="h6" sx={{ mb: 1, color: "text.primary" }}>
        Filter by Price
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Slider
        value={priceRange}
        onChange={handlePriceChange}
        valueLabelDisplay="auto"
        min={0}
        max={200}
        sx={{ mb: 2 }}
      />

      {/* Filter by Category */}
      <Typography variant="h6" sx={{ mb: 1, color: "text.primary" }}>
        Filter by Category
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <List sx={{ mb: 2 }}>
        {categories.map((category) => (
          <FormControlLabel
            key={category._id}
            control={
              <Checkbox
                name={category._id}
                checked={selectedCategories.has(category._id)}
                onChange={handleCategoryChange}
              />
            }
            label={category.name}
            sx={{
              padding: "10px",
              borderRadius: 1,
              "&:hover": {
                backgroundColor: "primary.light",
                color: "white",
              },
            }}
          />
        ))}
      </List>

      {/* Filter by Artisan */}
      <Typography variant="h6" sx={{ mb: 1, color: "text.primary" }}>
        Filter by Artisan
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <List sx={{ mb: 2 }}>
        {artisans.map((artisan) => (
          <FormControlLabel
            key={artisan._id}
            control={
              <Checkbox
                name={artisan._id}
                checked={selectedArtisans.has(artisan._id)}
                onChange={handleArtisanChange}
              />
            }
            label={artisan.firstname}
            sx={{
              padding: "10px",
              borderRadius: 1,
              "&:hover": {
                backgroundColor: "primary.light",
                color: "white",
              },
            }}
          />
        ))}
      </List>
    </Box>
  );
}
