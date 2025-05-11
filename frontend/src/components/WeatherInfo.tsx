import { Air, Opacity, Thermostat } from "@mui/icons-material";
import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { WeatherData } from "../types/weather";

interface WeatherInfoProps {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
}

const WeatherInfo = ({ weatherData, loading, error }: WeatherInfoProps) => {
  console.log("weather: ", weatherData);

  if (loading) {
    return <CircularProgress size={20} />;
  }

  if (error || !weatherData) {
    return <div>Error: {error}</div>;
  }

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Current Weather
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt={weatherData.weather[0].description}
            style={{ width: 50, height: 50 }}
          />
          <Typography>
            {weatherData.weather[0].main} - {weatherData.weather[0].description}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Thermostat color="action" />
          <Typography>
            Temperature: {Math.round(weatherData.main.temp)}°C (Feels like{" "}
            {Math.round(weatherData.main.feels_like)}°C)
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Opacity color="action" />
          <Typography>Humidity: {weatherData.main.humidity}%</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Air color="action" />
          <Typography>
            Wind Speed: {Math.round(weatherData.wind.speed * 3.6)} km/h
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default WeatherInfo;
