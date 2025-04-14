import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const MyBookings = () => {
  const { token, user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("⚠️ You must be logged in to view bookings.");
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        console.log("🟢 Sending token:", token); // DEBUG
        const res = await axios.get("http://localhost:5000/api/bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(res.data);
        console.log("✅ Bookings received:", res.data);
      } catch (err) {
        console.error("❌ Error fetching bookings:", err.response?.data?.message || err.message);
        setError(err.response?.data?.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (bookings.length === 0) return <p>No bookings found.</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎟️ My Bookings</h2>
      {bookings.map((booking) => (
        <div key={booking.id} style={styles.card}>
          <p><strong>Movie:</strong> {booking.movie}</p>
          <p><strong>Theater:</strong> {booking.theater}</p>
          <p><strong>Date:</strong> {booking.movie_date}</p>
          <p><strong>Day:</strong> {booking.movie_day}</p>
          <p><strong>Time:</strong> {booking.movie_time}</p>
          <p><strong>Seats:</strong> {booking.selected_seats}</p>
          <p><strong>Total Price:</strong> ₹{booking.total_price}</p>
          <p><strong>Booked On:</strong> {new Date(booking.booking_time).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "20px",
    background: "#FDFAF6",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    fontFamily: "'Josefin Sans', sans-serif",
  },
  title: {
    fontSize: "28px",
    marginBottom: "20px",
    color: "#333",
  },
  card: {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "20px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  },
};

export default MyBookings;
