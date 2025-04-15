import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
} from "@mui/material";
import backgroundImage from "../assets/movie-ticketing.jpg";
import axiosClient from "../api/axiosClient"; // ✅ Use axiosClient

const SignUp = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axiosClient.post("/api/signup", formData); // ✅ axiosClient

      if (response.status === 201) {
        login({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        });
        navigate("/");
      } else {
        setError(response.data.message || "Sign-up failed. Please try again.");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Error signing up. Please try again.";
      setError(errorMsg);
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Box
        sx={{
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "rgba(254, 254, 254, 0.9)",
          zIndex: 1,
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          align="center"
          sx={{ fontWeight: "bold", color: "#3F7D58" }}
        >
          Sign Up
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            onChange={handleChange}
            required
            sx={{ backgroundColor: "#FDFAF6" }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            onChange={handleChange}
            required
            sx={{ backgroundColor: "#FDFAF6" }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Phone"
            name="phone"
            type="tel"
            onChange={handleChange}
            required
            sx={{ backgroundColor: "#FDFAF6" }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type="password"
            onChange={handleChange}
            required
            sx={{ backgroundColor: "#FDFAF6" }}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              mt: 2,
              backgroundColor: "#EC5228",
              color: "#EFEFEF",
              "&:hover": { backgroundColor: "#99BC85" },
            }}
          >
            Sign Up
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default SignUp;
