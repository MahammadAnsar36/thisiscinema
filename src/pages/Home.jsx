import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import HeroSlider from "../components/HeroSlider";
import { Box, Typography, Grid, Container } from "@mui/material";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import { AuthContext } from "../context/AuthContext"; // ✅ Assumed auth context

const API_KEY = "bfe9cce63f5e42b7c67b220cc1d6c00f";
const BASE_URL = "https://api.themoviedb.org/3";

const Home = () => {
  const { city } = useParams();
  const [movies, setMovies] = useState([]);
  const { user, setUser } = useContext(AuthContext);

  // ✅ Ensure user is logged out on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setUser(null);
    }
  }, [setUser]);

  // ✅ Fetch only specific movies
  useEffect(() => {
    const fetchMoviesByTitles = async () => {
      try {
        const titles = ["AA22", "ntr31", "spirit", "peddi"];
        const moviePromises = titles.map((title) =>
          axios.get(`${BASE_URL}/search/movie`, {
            params: { api_key: API_KEY, query: title },
          })
        );

        const results = await Promise.all(moviePromises);
        const validMovies = results
          .map((res) => res.data.results?.[0])
          .filter(Boolean);

        setMovies(validMovies);
      } catch (error) {
        console.error("Error fetching specific movies:", error);
      }
    };

    fetchMoviesByTitles();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#FAF1E6",
      }}
    >
      {/* ✅ Hero Banner */}
      <HeroSlider />

      {/* ✅ Main Content */}
      <Box
        sx={{
          flex: 1,
          py: { xs: 4, sm: 5 },
          px: { xs: 2, sm: 4 },
        }}
      >
        <Container maxWidth="xl">
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: "bold",
              color: "#3F7D58",
              backgroundColor: "#FDFAF6",
              display: "inline-block",
              px: { xs: 2, sm: 4 },
              py: 2,
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
              mb: 4,
              fontSize: { xs: "1.5rem", sm: "2rem" },
            }}
          >
            Popular Telugu Movies
          </Typography>

          <Grid container spacing={{ xs: 2, sm: 4 }} justifyContent="center">
            {movies.map((movie) => (
              <Grid
                item
                key={movie.id}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <MovieCard movie={movie} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
