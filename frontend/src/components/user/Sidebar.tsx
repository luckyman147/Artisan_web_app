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
import { getAllcategories } from "../../apis/action";
import { useAppSelector } from "../../stores/storeHooks";
import { RootState } from "../../stores/store";
import { Category } from "../../apis/interfaces";

interface SidebarProps {
  onFilterChange: (filters: {
    search: string;
    priceRange: [number, number];
    stock: string[];
    categories: string[];
    artisans: string[];
    stockRange: [number, number];
  }) => void;
}

export default function Sidebar({ onFilterChange }: SidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedStock, setSelectedStock] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedArtisans, setSelectedArtisans] = useState<Set<string>>(new Set());
  const [stockRange, setStockRange] = useState<[number, number]>([0, 100]);

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
    fetchCategory();
  }, [id, token]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    applyFilters({ search: value });
  };

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

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const updatedStock = new Set(selectedStock);
    if (checked) {
      updatedStock.add(name);
    } else {
      updatedStock.delete(name);
    }
    setSelectedStock(updatedStock);
    applyFilters({ stock: Array.from(updatedStock) });
  };

  const handlePriceChange = (_: Event, value: number | number[]) => {
    setPriceRange(value as [number, number]);
    applyFilters({ priceRange: value as [number, number] });
  };

  const handleStockRangeChange = (_: Event, value: number | number[]) => {
    setStockRange(value as [number, number]);
    applyFilters({ stockRange: value as [number, number] });
  };

  const applyFilters = (updatedFilter: Partial<any>) => {
    onFilterChange({
      search: searchText,
      priceRange,
      stock: Array.from(selectedStock),
      categories: Array.from(selectedCategories),
      artisans: Array.from(selectedArtisans),
      stockRange,
      ...updatedFilter,
    });
  };

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: "#ffffff",
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        width: { xs: "100%", sm: 250, xl: "70%" },
        height: { xs: "auto", sm: "calc(100vh - 64px)", xl: "100%" },
        overflowY: "auto",
        marginTop: "5px",
        border: "1px solid #e0e0e0",
      }}
    >
      <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: "bold", textAlign: "center", color: "primary.main" }}
      >
        Filter Products
      </Typography>

      <TextField
        label="Search Products"
        variant="outlined"
        fullWidth
        value={searchText}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
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

      <Typography variant="h6" sx={{ mb: 1, color: "text.secondary" }}>
        Stock Range
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Slider
        value={stockRange}
        onChange={handleStockRangeChange}
        valueLabelDisplay="auto"
        min={0}
        max={100}
        sx={{ mb: 3 }}
      />

      <Typography variant="h6" sx={{ mb: 1, color: "text.secondary" }}>
        Price Range
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Slider
        value={priceRange}
        onChange={handlePriceChange}
        valueLabelDisplay="auto"
        min={0}
        max={200}
        sx={{ mb: 3 }}
      />

      <Typography variant="h6" sx={{ mb: 1, color: "text.secondary" }}>
        Categories
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <List sx={{ mb: 3 }}>
        {categories.map((category) => (
          <FormControlLabel
            key={category._id}
            control={
              <Checkbox
                name={category._id}
                checked={selectedCategories.has(category._id)}
                onChange={handleCategoryChange}
                sx={{
                  color: "primary.main",
                  "&.Mui-checked": {
                    color: "primary.main",
                  },
                }}
              />
            }
            label={category.name}
            sx={{
              padding: "18px",
              borderRadius: 1,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.05)",
              },
            }}
          />
        ))}
      </List>
    </Box>
  );
}
