import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Chip,
  CircularProgress,
  Fade,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchAllCountries,
  selectAllCountries,
  selectCountriesError,
  selectCountriesLoading,
} from "../store/slices/countriesSlice";
import CountryCard from "./CountryCard";
import { FixedSizeGrid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

const CountriesList = () => {
  const dispatch = useAppDispatch();
  const countries = useAppSelector(selectAllCountries);
  const loading = useAppSelector(selectCountriesLoading);
  const error = useAppSelector(selectCountriesError);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(countries);

  const regions = [...new Set(countries.map((country) => country.region))].sort();

  useEffect(() => {
    if (countries.length === 0) {
      dispatch(fetchAllCountries());
    }
  }, [dispatch, countries.length]);

  useEffect(() => {
    let result = countries;

    if (searchTerm) {
      result = result.filter(
        (country) =>
          country.name.common.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (country.capital &&
            country.capital[0]?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedRegion) {
      result = result.filter((country) => country.region === selectedRegion);
    }

    setFilteredCountries(result);
  }, [countries, searchTerm, selectedRegion]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleRegionChange = (event: SelectChangeEvent<string>) => {
    setSelectedRegion(event.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedRegion("");
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={800}>
      <Box p={4}>
        <Typography variant="h4" gutterBottom>
          Countries of the World
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              mb: 2,
            }}
          >
            <TextField
              fullWidth
              label="Search countries"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel id="region-select-label">Filter by Region</InputLabel>
              <Select
                labelId="region-select-label"
                value={selectedRegion}
                onChange={handleRegionChange}
                label="Filter by Region"
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon />
                  </InputAdornment>
                }
              >
                <MenuItem value="">
                  <em>All Regions</em>
                </MenuItem>
                {regions.map((region) => (
                  <MenuItem key={region} value={region}>
                    {region}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {(searchTerm || selectedRegion) && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2">Active filters:</Typography>
              {searchTerm && (
                <Chip
                  label={`Search: ${searchTerm}`}
                  onDelete={() => setSearchTerm("")}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {selectedRegion && (
                <Chip
                  label={`Region: ${selectedRegion}`}
                  onDelete={() => setSelectedRegion("")}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              <Chip
                label="Clear all"
                onClick={clearFilters}
                size="small"
                color="secondary"
              />
            </Box>
          )}
        </Paper>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredCountries.length} of {countries.length} countries
          </Typography>
        </Box>

        <Box sx={{ height: 600 }}>
          <AutoSizer>
            {({ height, width }) => (
              <FixedSizeGrid
                columnCount={4}
                columnWidth={width / 4}
                height={height}
                rowCount={Math.ceil(filteredCountries.length / 4)}
                rowHeight={370}
                width={width}
              >
                {({ columnIndex, rowIndex, style }) => {
                  const index = rowIndex * 4 + columnIndex;
                  if (index >= filteredCountries.length) return null;

                  const country = filteredCountries[index];
                  return (
                    <Box style={style} key={country.cca3}>
                      <CountryCard country={country} />
                    </Box>
                  );
                }}
              </FixedSizeGrid>
            )}
          </AutoSizer>
        </Box>

        {filteredCountries.length === 0 && (
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              No countries found matching your criteria
            </Typography>
          </Box>
        )}
      </Box>
    </Fade>
  );
};

export default CountriesList;
