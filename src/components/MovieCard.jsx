import React, { useEffect, useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Skeleton,
} from "@mui/material";
import { Link } from "react-router-dom";

const API_KEY = "bfe9cce63f5e42b7c67b220cc1d6c00f";
const BASE_URL = "https://api.themoviedb.org/3";

const MovieCard = ({ movie }) => {
  const [genres, setGenres] = useState([]);
  const [loadingGenres, setLoadingGenres] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const res = await fetch(`${BASE_URL}/movie/${movie.id}?api_key=${API_KEY}`);
        const data = await res.json();
        setGenres(data.genres.map((genre) => genre.name));
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoadingGenres(false);
      }
    };

    fetchMovieDetails();
  }, [movie.id]);

  return (
    <Card
      sx={{
        width: { xs: "100%", sm: 250, md: 240 },
        height: 420,
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.3s, box-shadow 0.3s",
        fontFamily: "'Josefin Sans', sans-serif",
        backgroundColor: "#FDFAF6",
        color: "#333",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        mx: "auto",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      {/* 🎬 Poster */}
      <Link to={`/movie/${movie.id}`} style={{ textDecoration: "none" }}>
        <CardMedia
          component="img"
          height="270"
          image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          sx={{
            objectFit: "cover",
            transition: "opacity 0.3s, filter 0.3s",
            "&:hover": { opacity: 0.85, filter: "brightness(0.85)" },
            cursor: "pointer",
          }}
        />
      </Link>

      {/* 📜 Movie Info */}
      <CardContent
        sx={{
          textAlign: "center",
          backgroundColor: "#FAF1E6",
          color: "#333",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "10px",
          borderRadius: "0 0 10px 10px",
        }}
      >
        {/* 🏷️ Title */}
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: "13px", sm: "14px" },
            fontWeight: "bold",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {movie.title}
        </Typography>

        {/* 🌍 Language & Rating */}
        <Typography
          variant="body2"
          sx={{ fontSize: "12px", opacity: 0.8, mt: 0.5 }}
        >
          {movie.original_language.toUpperCase()} | ⭐ {movie.vote_average.toFixed(1)}
        </Typography>

        {/* 🎭 Genres */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "4px",
            marginTop: "5px",
          }}
        >
          {loadingGenres
            ? [1, 2].map((i) => (
                <Skeleton
                  key={i}
                  variant="rounded"
                  width={60}
                  height={22}
                  sx={{ borderRadius: "12px" }}
                />
              ))
            : genres.slice(0, 2).map((genre, index) => (
                <Chip
                  key={index}
                  label={genre}
                  sx={{
                    backgroundColor: "#99BC85",
                    color: "#FDFAF6",
                    fontSize: "10px",
                    height: "22px",
                  }}
                />
              ))}
        </Box>

        {/* 🎟️ View Details */}
        <Button
          component={Link}
          to={`/movie/${movie.id}`}
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#99BC85",
            color: "#FFF",
            fontWeight: "bold",
            borderRadius: "6px",
            padding: "8px 0",
            marginTop: "8px",
            fontSize: "12px",
            transition: "all 0.3s",
            "&:hover": { backgroundColor: "#7BA370" },
          }}
        >
          🎟️ View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
