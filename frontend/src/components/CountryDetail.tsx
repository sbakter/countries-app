import {
  ArrowBack,
  LocationCity,
  Payment,
  People,
  Public,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { weatherApi } from "../api/services/weather";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchAllCountries,
  selectAllCountries,
  selectCountriesError,
  selectCountriesLoading,
} from "../store/slices/countriesSlice";
import { WeatherData } from "../types/weather";
import WeatherInfo from "./WeatherInfo";

const CountryDetail = () => {
  const { name } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const countries = useAppSelector(selectAllCountries);
  const loading = useAppSelector(selectCountriesLoading);
  const error = useAppSelector(selectCountriesError);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const country = countries.find(
    (country) =>
      country.name.common.toLowerCase() === decodeURIComponent(name || "")
  );

  useEffect(() => {
    if (!country) {
      dispatch(fetchAllCountries());
    }
  }, [country, dispatch]);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!country?.capital?.[0]) return;
      setWeatherLoading(true);
      setWeatherError(null);

      try {
        const data = await weatherApi.getWeatherByCity(country.capital[0]);
        setWeatherData(data as unknown as WeatherData);
      } catch (error) {
        console.log(error);
        setWeatherError("Failed to fetch weather data");
      } finally {
        setWeatherLoading(false);
      }
    };
    fetchWeather();
  }, [country]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!country) {
    return <div>Country not found</div>;
  }

  const getCurrencies = () => {
    if (!country.currencies) return "None";
    return Object.entries(country.currencies)
      .map(
        ([code, currency]) => `${currency.name} (${currency.symbol}) [${code}]`
      )
      .join(", ");
  };

  return (
    <Box p={4}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/countries")}
        sx={{ mb: 4 }}
      >
        Back to Countries
      </Button>
      <Card>
        <CardMedia
          component="img"
          height="300"
          image={country.flags.png}
          alt={country.flags.alt || `Flag of ${country.name.common}`}
        />
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {country.name.common}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {country.name.official}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
            <Public color="action" />
            <Typography variant="body1">
              Region: {country.region}
              {country.subregion && ` (${country.subregion})`}
            </Typography>
          </Box>
          {country.capital && (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
              <LocationCity color="action" />
              <Typography variant="body1">
                Capital: {country.capital.join(", ")}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
            <People color="action" />
            <Typography variant="body1">
              Population: {country.population.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Payment color="action" />
            <Typography variant="body1">
              Currencies: {getCurrencies()}
            </Typography>
          </Box>
        </CardContent>
      </Card>
      {weatherData && (
        <WeatherInfo
          weatherData={weatherData}
          loading={weatherLoading}
          error={weatherError}
        />
      )}
    </Box>
  );
};

export default CountryDetail;
