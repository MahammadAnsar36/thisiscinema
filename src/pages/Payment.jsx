import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Paper,
  CardMedia,
} from "@mui/material";
import axios from "axios";
import emailjs from "@emailjs/browser";

// ✅ EmailJS Configuration
const SERVICE_ID = "service_1yqri5o";
const TEMPLATE_ID = "template_1wv0snb";
const PUBLIC_KEY = "cKNIFk5S18ngZ8qOV";

const API_KEY = "bfe9cce63f5e42b7c67b220cc1d6c00f";
const BASE_URL = "https://api.themoviedb.org/3";

const Payment = () => {
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [movieImage, setMovieImage] = useState("");
  const printRef = useRef();

  useEffect(() => {
    const storedDetails = JSON.parse(localStorage.getItem("bookingDetails"));
    const userToken = localStorage.getItem("userToken");

    if (!storedDetails || !userToken) {
      setError("⚠️ Booking details or authentication missing! Redirecting...");
      setTimeout(() => navigate("/"), 3000);
      return;
    }

    setBookingDetails(storedDetails);
    fetchMoviePoster(storedDetails.movie);
  }, [navigate]);

  const fetchMoviePoster = async (movieName) => {
    try {
      const res = await axios.get(`${BASE_URL}/search/movie`, {
        params: { api_key: API_KEY, query: movieName },
      });
      if (res.data.results.length > 0) {
        const posterPath = res.data.results[0].poster_path;
        const imageUrl = `https://image.tmdb.org/t/p/w200${posterPath}`;
        setMovieImage(imageUrl);
      }
    } catch (err) {
      console.error("Error fetching movie image:", err.message);
    }
  };

  const sendEmail = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.email) {
      console.error("❌ User email missing in localStorage");
      return;
    }

    const templateParams = {
      to_name: user.name || "Customer",
      to_email: user.email,
      movie: bookingDetails.movie,
      theater: bookingDetails.theater,
      date: bookingDetails.movie_date,
      time: bookingDetails.movie_time,
      seats: bookingDetails.selectedSeats.map((s) => s.id).join(", "),
      total: `₹${bookingDetails.totalPrice}`,
    };

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then(() => console.log("📧 Email sent successfully!"))
      .catch((err) => console.error("❌ Failed to send email:", err));
  };

  const handlePayment = async () => {
    if (!bookingDetails) {
      setError("⚠️ Booking details are missing. Please try again.");
      return;
    }

    const {
      movie,
      theater,
      selectedSeats,
      totalPrice,
      movie_date,
      movie_day,
      movie_time,
    } = bookingDetails;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        setError("⚠️ Authentication failed. Please log in again.");
        return;
      }

      const postData = {
        movie,
        theater,
        selectedSeats: selectedSeats.map((seat) => seat.id),
        totalPrice,
        movie_date,
        movie_day,
        movie_time,
      };

      const response = await axios.post("http://localhost:5000/api/book", postData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setSuccess("✅ Payment successful! Your ticket is booked. 🎟️");
        sendEmail(); // ✅ Email is sent here
        localStorage.removeItem("bookingDetails");
        setDialogOpen(true);
      } else {
        setError(response.data.message || "❌ Payment failed. Try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "❌ Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const content = printRef.current;
    const printWindow = window.open("", "_blank", "width=600,height=800");
    printWindow.document.write(`
      <html><head><title>Ticket - ThisIsCinema</title>
      <style>
        body { font-family: 'Josefin Sans', sans-serif; padding: 20px; background-color: #FDFAF6; color: #333; }
        .ticket-wrapper { width: 420px; margin: auto; border: 2px dashed #99BC85; border-radius: 12px; padding: 20px; background-color: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.2); }
        .poster { width: 100%; border-radius: 8px; margin-bottom: 15px; }
        .details { font-size: 16px; margin: 10px 0; line-height: 1.5; }
        .footer { text-align: center; font-size: 14px; color: #666; margin-top: 20px; border-top: 1px solid #ccc; padding-top: 10px; }
      </style></head>
      <body>
        <div class="ticket-wrapper">
          ${content.innerHTML}
          <div class="footer">
            Thank you for booking with <strong>ThisIsCinema 🎬</strong><br/>
            Please reach 15 mins before showtime.
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#FDFAF6", p: { xs: 2, md: 4 }, display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Paper elevation={6} sx={{ backgroundColor: "#fff", p: { xs: 3, sm: 4 }, borderRadius: "12px", width: "100%", maxWidth: "500px", textAlign: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#222", mb: 3 }}>💳 Secure Payment</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {bookingDetails ? (
          <>
            <Box sx={{ backgroundColor: "#FAF1E6", p: 2, borderRadius: "10px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", mb: 3 }}>
              <Typography variant="h6" sx={{ color: "#D32F2F", fontWeight: "bold", mb: 1 }}>🎟️ BOOKING SUMMARY</Typography>
              <Typography><strong>{bookingDetails.movie}</strong> - {bookingDetails.selectedSeats.map(seat => seat.id).join(", ")} ({bookingDetails.selectedSeats.length} Tickets)</Typography>
              <Typography sx={{ fontSize: "14px", color: "#666" }}>{bookingDetails.theater}, Screen 2</Typography>
              <Typography sx={{ fontSize: "14px", color: "#666" }}>Date: <strong>{bookingDetails.movie_date}</strong> | Time: <strong>{bookingDetails.movie_time}</strong></Typography>
              <Divider sx={{ my: 2 }} />
              <Typography sx={{ display: "flex", justifyContent: "space-between" }}><span>Ticket Price:</span><strong>₹{bookingDetails.totalPrice - 37.76}</strong></Typography>
              <Typography sx={{ display: "flex", justifyContent: "space-between" }}><span>Convenience Fee:</span><strong>₹37.76</strong></Typography>
              <Typography sx={{ fontWeight: "bold", display: "flex", justifyContent: "space-between", mt: 2 }}><span>Total:</span><strong style={{ color: "#D32F2F" }}>₹{bookingDetails.totalPrice}</strong></Typography>
            </Box>

            <Button variant="contained" onClick={handlePayment} disabled={loading} sx={{ backgroundColor: "#99BC85", color: "#fff", fontWeight: "bold", px: 4, py: 1.5, borderRadius: "8px", fontSize: "16px", "&:hover": { backgroundColor: "#88A776" } }}>
              {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Proceed to Pay"}
            </Button>
          </>
        ) : (
          <Alert severity="warning">⚠️ No booking details found.</Alert>
        )}
      </Paper>

      {/* ✅ Ticket Dialog */}
      <Dialog open={dialogOpen} onClose={() => navigate("/")} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: "bold", color: "#28A745" }}>🎟️ Tickets Booked Successfully!</DialogTitle>
        <DialogContent>
          <Box ref={printRef} sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "center", sm: "flex-start" }, gap: 2, mt: 1 }}>
            {movieImage && (
              <CardMedia component="img" src={movieImage} alt="Movie Poster" sx={{ width: 100, height: 150, borderRadius: "6px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }} />
            )}
            <Box>
              <Typography className="details"><strong>Movie:</strong> {bookingDetails?.movie}</Typography>
              <Typography className="details"><strong>Theater:</strong> {bookingDetails?.theater}</Typography>
              <Typography className="details"><strong>Date:</strong> {bookingDetails?.movie_date}</Typography>
              <Typography className="details"><strong>Time:</strong> {bookingDetails?.movie_time}</Typography>
              <Typography className="details"><strong>Seats:</strong> {bookingDetails?.selectedSeats.map(seat => seat.id).join(", ")}</Typography>
              <Typography className="details"><strong>Total:</strong> ₹{bookingDetails?.totalPrice}</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", px: 3 }}>
          <Button onClick={handleDownload} sx={{ backgroundColor: "#555", color: "#fff", fontWeight: "bold", borderRadius: "8px", "&:hover": { backgroundColor: "#333" } }}>🧾 Download Ticket</Button>
          <Button onClick={() => navigate("/")} sx={{ backgroundColor: "#28A745", color: "#fff", fontWeight: "bold", px: 3, py: 1, borderRadius: "8px", "&:hover": { backgroundColor: "#218838" } }}>OK</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payment;
