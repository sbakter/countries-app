import { Box } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthRedirect } from "./components/Auth/AuthRedirect";
import { Login } from "./components/Auth/Login";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import CountriesList from "./components/CountriesList";
import CountryDetail from "./components/CountryDetail";
import Favourites from "./components/Favourites";
import { Navigation } from "./components/Navigation";
import ProtectedTestData from "./components/ProtectedTestData";
import { TestData } from "./components/TestData";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Box>
          <Navigation />
          <Box sx={{ p: 3 }}>
            <Routes>
              <Route
                path="/login"
                element={
                  <>
                    <AuthRedirect />
                    <Login />
                  </>
                }
              />
              <Route path="/test" element={<TestData />} />
              <Route path="/countries" element={<CountriesList />} />
              <Route path="/countries/:name" element={<CountryDetail />} />
              <Route
                path="/protected"
                element={
                  <ProtectedRoute>
                    <ProtectedTestData />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <Favourites />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<div>Home is here</div>} />
              {/* Other routes... */}
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
