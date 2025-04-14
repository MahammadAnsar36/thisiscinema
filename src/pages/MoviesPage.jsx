import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import HeroSlider from "../components/HeroSlider";
import MovieCard from "../components/MovieCard";

const API_KEY = "bfe9cce63f5e42b7c67b220cc1d6c00f";
const BASE_URL = "https://api.themoviedb.org/3";
const INDIAN_LANGUAGES = ["hi", "te", "ta", "ml", "kn"];

const MoviesPage = () => {
  const { city } = useParams();
  const [loading, setLoading] = useState(true);
  const [heroMovies, setHeroMovies] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [reReleaseMovies, setReReleaseMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);

        const trending = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&region=IN`).then(res => res.json());
        const nowPlaying = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&region=IN`).then(res => res.json());
        const upcoming = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&region=IN`).then(res => res.json());
        const topRated = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&region=IN`).then(res => res.json());

        const fetchMovieByTitle = async (title) => {
          const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${title}&region=IN`);
          const data = await response.json();
          return data.results[0];
        };

        const arya2 = await fetchMovieByTitle("Arya 2");
        const raceGurram = await fetchMovieByTitle("Race Gurram");
        const ddlj = await fetchMovieByTitle("Dilwale Dulhania Le Jayenge");
        const k3g = await fetchMovieByTitle("Kabhi Khushi Kabhie Gham");

        const filterIndianMovies = (movies) =>
          movies.results.filter((movie) => INDIAN_LANGUAGES.includes(movie.original_language));

        setHeroMovies(filterIndianMovies(trending).slice(0, 5));
        setNewReleases(filterIndianMovies(nowPlaying).slice(0, 20));
        setUpcomingMovies(filterIndianMovies(upcoming).slice(0, 20));

        const pastReleases = filterIndianMovies(topRated).slice(0, 15);
        const specialMovies = [arya2, raceGurram, ddlj, k3g].filter(Boolean);
        setReReleaseMovies([...specialMovies, ...pastReleases]);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, [city]);

  return (
    <Box
      sx={{
        padding: "80px 20px",
        fontFamily: "'Josefin Sans', sans-serif",
        backgroundColor: "#FAF1E6",
        color: "#333",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          marginBottom: 3,
          textAlign: "center",
          color: "#99BC85",
          letterSpacing: "1px",
        }}
      >
        🎬 Indian Movies in {city.charAt(0).toUpperCase() + city.slice(1)}
      </Typography>

      {heroMovies.length > 0 && <HeroSlider movies={heroMovies} />}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress sx={{ color: "#99BC85" }} />
        </Box>
      ) : (
        <>
          {/* 🆕 New Releases */}
          <Typography
            variant="h5"
            sx={{
              marginTop: 5,
              marginBottom: 2,
              color: "#D85C41",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            🎬 New Releases
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {newReleases.map((movie) => (
              <Grid item key={movie.id} xs={6} sm={4} md={3} lg={2.4}>
                <MovieCard movie={movie} />
              </Grid>
            ))}
          </Grid>

          {/* 🔜 Upcoming Movies */}
          <Typography
            variant="h5"
            sx={{
              marginTop: 5,
              marginBottom: 2,
              color: "#3F7D58",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            🚀 Upcoming Movies
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {upcomingMovies.map((movie) => (
              <Grid item key={movie.id} xs={6} sm={4} md={3} lg={2.4}>
                <MovieCard movie={movie} />
              </Grid>
            ))}
          </Grid>

          {/* 🔁 Re-Releases */}
          <Typography
            variant="h5"
            sx={{
              marginTop: 5,
              marginBottom: 2,
              color: "#2A3D45",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            🔄 Re-Releases (Past Hits)
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {reReleaseMovies.map((movie) => (
              <Grid item key={movie.id} xs={6} sm={4} md={3} lg={2.4}>
                <MovieCard movie={movie} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default MoviesPage;
