import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // ✅ Import AuthContext
import { TextField, Button, Box, Typography, Container, CircularProgress } from "@mui/material";
import backgroundImage from "../assets/movie-ticketing.jpg"; // ✅ Ensure correct path

const SignIn = () => {
    const { login } = useContext(AuthContext); // ✅ Use login function from AuthContext
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // ✅ Save JWT token & user details in localStorage
                localStorage.setItem("userToken", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                login(data.user); // ✅ Update AuthContext

                // ✅ Redirect to last visited page or home
                const redirectTo = location.state?.from?.pathname || "/";
                navigate(redirectTo, { replace: true });
            } else {
                setError(data.message || "Invalid email or password.");
            }
        } catch (error) {
            setError("Error signing in. Please check your connection.");
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
                    boxShadow: 3,
                    borderRadius: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.9)", // ✅ Transparent white for readability
                    textAlign: "center",
                    zIndex: 1,
                }}
            >
                <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#3F7D58" }}>
                    🎟️ Sign In
                </Typography>
                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
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
                        sx={{ backgroundColor: "#FDFAF6" }}
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
                        sx={{ backgroundColor: "#FDFAF6" }}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        sx={{
                            mt: 3,
                            backgroundColor: "#EC5228",
                            color: "#EFEFEF",
                            "&:hover": { backgroundColor: "#99BC85" },
                        }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Sign In"}
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default SignIn;
