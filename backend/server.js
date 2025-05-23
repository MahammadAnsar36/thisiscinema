const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors({
    origin: "https://thisiscinema.onrender.com", // ✅ allow frontend domain
    credentials: true,
  }));
app.use(express.json());

const SECRET_KEY = "YOUR_SECRET_KEY";

// ✅ MySQL Connection
require("dotenv").config();
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
  console.log("✅ MySQL Connected...");
});

// ✅ JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "Access denied. No token provided." });

  jwt.verify(token.split(" ")[1], SECRET_KEY, (err, user) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};
app.get("/", (req, res) => {
    res.send("🎉 ThisIsCinema Backend is running successfully!");
  });
  
// ✅ Signup
app.post("/api/signup", async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "⚠️ All fields are required!" });
  }

  db.query("SELECT id FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length > 0) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)",
      [name, email, phone, hashedPassword],
      (err) => {
        if (err) return res.status(500).json({ message: "Database error", error: err.sqlMessage });
        res.status(201).json({ message: "User registered successfully" });
      }
    );
  });
});

// ✅ Signin
app.post("/api/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "⚠️ Email and password are required!" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length === 0) return res.status(400).json({ message: "User not found" });

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "✅ Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
    });
  });
});

// ✅ Booking (Email logic removed)
app.post("/api/book", authenticateToken, (req, res) => {
  const {
    movie,
    theater,
    selectedSeats,
    totalPrice,
    movie_date,
    movie_day,
    movie_time,
  } = req.body;

  const missingFields = [];
  if (!movie) missingFields.push("movie");
  if (!theater) missingFields.push("theater");
  if (!selectedSeats?.length) missingFields.push("selectedSeats");
  if (!totalPrice) missingFields.push("totalPrice");
  if (!movie_date) missingFields.push("movie_date");
  if (!movie_day) missingFields.push("movie_day");
  if (!movie_time) missingFields.push("movie_time");

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `⚠️ Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  const userEmail = req.user.email;
  const seatNumbers = selectedSeats.join(", ");
  const bookingTime = new Date();

  let formattedDate, formattedTime;
  try {
    formattedDate = new Date(movie_date).toISOString().split("T")[0];
    const timeParts = movie_time.match(/(\d+):(\d+)\s?(AM|PM)/i);
    let hours = parseInt(timeParts[1], 10);
    const minutes = timeParts[2];
    const meridian = timeParts[3].toUpperCase();
    if (meridian === "PM" && hours < 12) hours += 12;
    if (meridian === "AM" && hours === 12) hours = 0;
    formattedTime = `${hours.toString().padStart(2, "0")}:${minutes}:00`;
  } catch {
    return res.status(400).json({ message: "Invalid date or time format" });
  }

  const sql = `
    INSERT INTO bookings (
      user_email, theater, movie, movie_date, 
      movie_day, movie_time, selected_seats, total_price, booking_time
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      userEmail,
      theater,
      movie,
      formattedDate,
      movie_day,
      formattedTime,
      seatNumbers,
      totalPrice,
      bookingTime,
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Booking Error:", err.sqlMessage);
        return res.status(500).json({ message: "Booking failed", error: err.sqlMessage });
      }

      res.status(200).json({
        message: "🎟️ Booking Confirmed!",
        bookingId: result.insertId,
        bookingDetails: {
          userEmail,
          movie,
          theater,
          movie_date: formattedDate,
          movie_day,
          movie_time: formattedTime,
          seats: seatNumbers,
          totalPrice,
          bookingTime,
        },
      });
    }
  );
});

// ✅ Fetch Bookings
app.get("/api/bookings", authenticateToken, (req, res) => {
  const userEmail = req.user.email;
  db.query("SELECT * FROM bookings WHERE user_email = ?", [userEmail], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length === 0) return res.status(404).json({ message: "No bookings found" });
    res.json(result);
  });
});

// ✅ Server Start
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
