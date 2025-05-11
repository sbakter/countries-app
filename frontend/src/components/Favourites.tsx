import { Alert, Box, CircularProgress, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { favoritesApi } from "../api/services/favorites";
import { useAuth } from "../context/AuthContext";
import { useAppSelector } from "../store/hooks";
import { selectAllCountries } from "../store/slices/countriesSlice";
import { CountryFavorite } from "../types/favorite";
import CountryCard from "./CountryCard";

const Favourites = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<CountryFavorite[]>([]);
  const allCountries = useAppSelector(selectAllCountries);

  useEffect(() => {
    if (!user) return;

    const fetchFavourites = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await favoritesApi.getFavorites();
        setFavorites(data);
      } catch (error) {
        console.error("Error fetching favourites: ", error);
        setError("Failed to load favourites. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, [user]);

  const convertToCountry = (favorite: CountryFavorite) => {
    const fullCountry = allCountries.find(
      (c) => c.name.common === favorite.country_name
    );

    if (fullCountry) {
      return fullCountry;
    }

    return {
      name: {
        common: favorite.country_name,
        official: favorite.country_name,
      },
      cca3: favorite.country_code,
      flags: {
        png: favorite.country_flag,
        svg: favorite.country_flag,
      },
      region: "Favorite",
      subregion: "Favorite",
      population: 0,
      capital: ["Favourite"],
      currencies: {
        FAV: {
          name: "Favourite Currency",
          symbol: "FAV",
        },
      },
      languages: {
        FAV: "Favourite Language",
      },
    };
  };

  if (!user) {
    return <div>Please login to view your favourites</div>;
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Favourite Countries
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {favorites.length === 0 ? (
        <Alert severity="info">You have no favourite countries yet.</Alert>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((favorite) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={favorite.id}>
              <CountryCard country={convertToCountry(favorite)} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Favourites;
