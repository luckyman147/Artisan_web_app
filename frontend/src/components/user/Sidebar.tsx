import {
  Box,
  FormControlLabel,
  Checkbox,
  List,
  Typography,
  TextField,
  IconButton,
  Slider,
  Paper,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
  InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { getAllcategories } from "../../apis/action";
import { useAppSelector } from "../../stores/storeHooks";
import { RootState } from "../../stores/store";
import { Category } from "../../apis/interfaces";
import { styled } from "@mui/material/styles";

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

const FilterContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  height: '100%',
  overflowY: 'auto',
  border: 'none',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  transition: 'all 0.3s ease',
  [theme.breakpoints.up('sm')]: {
    position: 'sticky',
    top: theme.spacing(2)
  }
}));

const FilterHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper
}));

const FilterSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none'
  }
}));

const RangeContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 2),
  marginBottom: theme.spacing(1)
}));

const RangeValues = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: theme.spacing(-1),
  color: theme.palette.text.secondary
}));

const CategoryItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 0),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderRadius: theme.shape.borderRadius
  }
}));

const MobileFilterButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  zIndex: theme.zIndex.speedDial,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  boxShadow: theme.shadows[6],
  '&:hover': {
    backgroundColor: theme.palette.primary.dark
  }
}));

export default function Sidebar({ onFilterChange }: SidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [stockRange, setStockRange] = useState<[number, number]>([0, 100]);
  const [mobileOpen, setMobileOpen] = useState(false);

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
      stock: [],
      categories: Array.from(selectedCategories),
      artisans: [],
      stockRange,
      ...updatedFilter,
    });
  };

  const handleClearFilters = () => {
    setSearchText("");
    setPriceRange([0, 200]);
    setSelectedCategories(new Set());
    setStockRange([0, 100]);
    applyFilters({
      search: "",
      priceRange: [0, 200],
      categories: [],
      stockRange: [0, 100]
    });
  };

  const toggleMobileFilters = () => {
    setMobileOpen(!mobileOpen);
  };

  const filterContent = (
    <FilterContainer>
      <FilterHeader>
        <Typography variant="h6" fontWeight={600}>
          Filters
        </Typography>
        <Chip
          label="Clear all"
          onClick={handleClearFilters}
          size="small"
          disabled={selectedCategories.size === 0 && priceRange[0] === 0 && priceRange[1] === 200}
        />
      </FilterHeader>

      <FilterSection>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search products..."
          value={searchText}
          onChange={handleSearchChange}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 1
            }
          }}
        />
      </FilterSection>

      {selectedCategories.size > 0 && (
        <FilterSection>
          <Typography variant="subtitle2" gutterBottom>
            Selected Categories
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {Array.from(selectedCategories).map(catId => {
              const category = categories.find(c => c._id === catId);
              return category ? (
                <Chip
                  key={catId}
                  label={category.name}
                  onDelete={() => {
                    const newSet = new Set(selectedCategories);
                    newSet.delete(catId);
                    setSelectedCategories(newSet);
                    applyFilters({ categories: Array.from(newSet) });
                  }}
                  size="small"
                />
              ) : null;
            })}
          </Stack>
        </FilterSection>
      )}

      <FilterSection>
        <Typography variant="subtitle2" gutterBottom>
          Price Range
        </Typography>
        <RangeContainer>
          <Slider
            value={priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={200}
            sx={{
              '& .MuiSlider-valueLabel': {
                backgroundColor: theme.palette.primary.main
              }
            }}
          />
          <RangeValues>
            <Typography variant="caption">${priceRange[0]}</Typography>
            <Typography variant="caption">${priceRange[1]}</Typography>
          </RangeValues>
        </RangeContainer>
      </FilterSection>

      <FilterSection>
        <Typography variant="subtitle2" gutterBottom>
          Stock Range
        </Typography>
        <RangeContainer>
          <Slider
            value={stockRange}
            onChange={handleStockRangeChange}
            valueLabelDisplay="auto"
            min={0}
            max={100}
            sx={{
              '& .MuiSlider-valueLabel': {
                backgroundColor: theme.palette.primary.main
              }
            }}
          />
          <RangeValues>
            <Typography variant="caption">{stockRange[0]} units</Typography>
            <Typography variant="caption">{stockRange[1]} units</Typography>
          </RangeValues>
        </RangeContainer>
      </FilterSection>

      <FilterSection>
        <Typography variant="subtitle2" gutterBottom>
          Categories ({categories.length})
        </Typography>
        <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
          {categories.map((category) => (
            <CategoryItem key={category._id}>
              <FormControlLabel
                control={
                  <Checkbox
                    name={category._id}
                    checked={selectedCategories.has(category._id)}
                    onChange={handleCategoryChange}
                    size="small"
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    {category.name}
                  </Typography>
                }
                sx={{ ml: 0, width: '100%' }}
              />
            </CategoryItem>
          ))}
        </List>
      </FilterSection>
    </FilterContainer>
  );

  return (
    <>
      {!isMobile && (
        <Box sx={{ width: 280, mr: 3, display: { xs: 'none', sm: 'block' } }}>
          {filterContent}
        </Box>
      )}

      {isMobile && (
        <MobileFilterButton onClick={toggleMobileFilters}>
          {mobileOpen ? <CloseIcon /> : <FilterListIcon />}
        </MobileFilterButton>
      )}

      {isMobile && mobileOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: theme.zIndex.drawer,
            display: { xs: 'block', sm: 'none' }
          }}
          onClick={toggleMobileFilters}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '85%',
              height: '100%',
              backgroundColor: 'background.paper',
              boxShadow: 24,
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {filterContent}
          </Box>
        </Box>
      )}
    </>
  );
}