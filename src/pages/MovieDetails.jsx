import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  DialogContent,
  IconButton,
  DialogTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

const API_KEY = "bfe9cce63f5e42b7c67b220cc1d6c00f";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false); // ✅ Modal state

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos`);
        const data = await res.json();

        setMovie(data);
        setCast(data.credits.cast.slice(0, 8));
        setCrew(data.credits.crew.filter((member) => ["Director", "Writer", "Producer", "Cinematographer"].includes(member.job)).slice(0, 6));

        const trailer = data.videos.results.find((video) => video.type === "Trailer" && video.site === "YouTube");
        if (trailer) {
          setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}?autoplay=1`);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress sx={{ color: "#99BC85" }} />
      </Box>
    );
  }

  const isUpcoming = new Date(movie.release_date) > new Date();

  return (
    <Box
      sx={{
        padding: "120px 20px 40px",
        fontFamily: "'Josefin Sans', sans-serif",
        backgroundColor: "#FAF1E6",
        minHeight: "100vh",
        color: "#333",
      }}
    >
      {/* 🎬 Movie Info Section */}
      <Grid container spacing={4} alignItems="center">
        {/* 📸 Movie Poster with Trailer Button */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: "relative", borderRadius: "16px", boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" }}>
            <CardMedia
              component="img"
              image={`${IMAGE_BASE_URL}${movie.poster_path}`}
              alt={movie.title}
              sx={{
                borderRadius: "16px",
                width: "100%",
                height: "500px",
                objectFit: "cover",
                transition: "transform 0.3s",
                "&:hover": { transform: "scale(1.05)" },
              }}
            />

            {trailerUrl && (
              <Button
                onClick={() => setOpen(true)}
                sx={{
                  position: "absolute",
                  bottom: "20px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "rgba(0,0,0,0.7)",
                  color: "#FFF",
                  fontWeight: "bold",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  transition: "all 0.3s",
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.9)" },
                }}
              >
                <PlayCircleOutlineIcon sx={{ marginRight: "6px" }} /> Watch Trailer
              </Button>
            )}
          </Card>
        </Grid>

        {/* 📄 Movie Details */}
        <Grid item xs={12} md={8}>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#99BC85" }}>
            {movie.title}
          </Typography>
          <Typography variant="h6" sx={{ color: "#D85C41", marginBottom: 2 }}>
            ⭐ {movie.vote_average.toFixed(1)} / 10 | 🎬 {movie.release_date}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, marginBottom: 3 }}>
            {movie.overview}
          </Typography>

          {!isUpcoming && (
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate(`/book-tickets/${movie.id}`)}
              sx={{
                backgroundColor: "#99BC85",
                color: "#FFF",
                fontWeight: "bold",
                fontSize: "18px",
                borderRadius: "8px",
                padding: "12px 0",
                transition: "all 0.3s",
                marginTop: "20px",
                "&:hover": { backgroundColor: "#7BA370" },
              }}
            >
              🎟️ Book Tickets
            </Button>
          )}
        </Grid>
      </Grid>

      {/* 🎭 Cast Section */}
      <Typography variant="h5" sx={{ fontWeight: "bold", marginTop: 5, color: "#2A3D45" }}>
        🎭 Cast
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {cast.map((actor) => (
          <Grid item key={actor.id} xs={6} sm={4} md={3} lg={2}>
            <Card sx={{ textAlign: "center", borderRadius: "12px", "&:hover": { transform: "scale(1.05)" } }}>
              <CardMedia
                component="img"
                image={`${IMAGE_BASE_URL}${actor.profile_path}`}
                alt={actor.name}
                sx={{ height: "200px", objectFit: "cover" }}
              />
              <CardContent>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {actor.name}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  {actor.character}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 🎬 Crew Section */}
      <Typography variant="h5" sx={{ fontWeight: "bold", marginTop: 5, color: "#2A3D45" }}>
        🎬 Crew
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {crew.map((member) => (
          <Grid item key={member.id} xs={6} sm={4} md={3}>
            <Card sx={{ textAlign: "center", borderRadius: "12px", padding: "16px", backgroundColor: "#FDFAF6" }}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {member.name}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                {member.job}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 🎬 Trailer Modal */}
      {trailerUrl && (
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 20px",
              backgroundColor: "#222",
              color: "#fff",
            }}
          >
            🎬 Trailer - {movie.title}
            <IconButton onClick={() => setOpen(false)} sx={{ color: "#fff" }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent
            sx={{
              p: 0,
              height: "500px",
              backgroundColor: "#000",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <iframe
              width="100%"
              height="100%"
              src={trailerUrl}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Movie Trailer"
              style={{ borderRadius: "8px" }}
            ></iframe>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default MovieDetails;
