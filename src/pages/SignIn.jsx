import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  CircularProgress,
  Alert,
} from "@mui/material";
import backgroundImage from "../assets/movie-ticketing.jpg";
import axiosClient from "../api/axiosClient";

const SignIn = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axiosClient.post("/api/signin", formData);

      localStorage.setItem("userToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      login(response.data.user);

      const redirectTo = location.state?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Error signing in. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="false"
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
          boxShadow: 4,
          borderRadius: 3,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          textAlign: "center",
          zIndex: 1,
          backdropFilter: "blur(3px)",
          animation: "fadeIn 0.8s ease-in-out",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#3F7D58",
            mb: 1,
            letterSpacing: "1px",
          }}
        >
          🎟️ Welcome Back
        </Typography>
        <Typography variant="body2" sx={{ color: "#555", mb: 2 }}>
          Sign in to book your tickets instantly
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            sx={{
              backgroundColor: "#FDFAF6",
              borderRadius: "6px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ccc" },
                "&:hover fieldset": { borderColor: "#3F7D58" },
                "&.Mui-focused fieldset": { borderColor: "#3F7D58" },
              },
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            sx={{
              backgroundColor: "#FDFAF6",
              borderRadius: "6px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ccc" },
                "&:hover fieldset": { borderColor: "#3F7D58" },
                "&.Mui-focused fieldset": { borderColor: "#3F7D58" },
              },
            }}
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              mt: 3,
              backgroundColor: "#EC5228",
              color: "#EFEFEF",
              fontWeight: "bold",
              py: 1.5,
              fontSize: "16px",
              borderRadius: "8px",
              transition: "all 0.3s",
              "&:hover": {
                backgroundColor: "#99BC85",
              },
            }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default SignIn;
