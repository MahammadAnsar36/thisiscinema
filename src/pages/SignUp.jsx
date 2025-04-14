import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // ✅ Import AuthContext
import { TextField, Button, Box, Typography, Container } from "@mui/material";
import backgroundImage from "../assets/movie-ticketing.jpg"; // Ensure this path is correct

const SignUp = () => {
    const { login } = useContext(AuthContext); // ✅ Use login function from AuthContext
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:5000/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                login({ name: formData.name, email: formData.email, phone: formData.phone }); // ✅ Update Navbar immediately
                navigate("/"); // ✅ Redirect to Home
            } else {
                setError(data.message || "Sign-up failed. Please try again.");
            }
        } catch (error) {
            setError("Error signing up. Please try again.");
        }
    };

    return (
        <Container
            maxWidth={false} // Allow full width
            sx={{
                // Set the background image and cover it
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "100vh", // Full height
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative", // Positioning for the overlay
            }}
        >
            <Box
                sx={{
                    p: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    backgroundColor: "rgba(254, 254, 254, 0.9)", // Slightly transparent white for readability
                    zIndex: 1, // Ensure the box is on top of the background
                }}
            >
                <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: "bold", color: "#3F7D58" }}>
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
                        sx={{ backgroundColor: "#FDFAF6" }} // Input field background color
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        name="email"
                        type="email"
                        onChange={handleChange}
                        required
                        sx={{ backgroundColor: "#FDFAF6" }} // Input field background color
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Phone"
                        name="phone"
                        type="tel"
                        onChange={handleChange}
                        required
                        sx={{ backgroundColor: "#FDFAF6" }} // Input field background color
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Password"
                        name="password"
                        type="password"
                        onChange={handleChange}
                        required
                        sx={{ backgroundColor: "#FDFAF6" }} // Input field background color
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        sx={{
                            mt: 2,
                            backgroundColor: "#EC5228",
                            color: "#EFEFEF",
                            "&:hover": { backgroundColor: "#99BC85" }, // Hover effect
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
