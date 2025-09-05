# 🎬 ThisIsCinema Movie Booking site

A full-stack movie ticket booking application built with **React.js**, **Node.js (Express)**, and **MySQL/XAMPP**.  
Users can browse movies, select theaters & showtimes, choose seats, make payments, and store their bookings in a database.  

---

## ✨ Features

- 🔐 **User Authentication** – Login & Register with secure JWT authentication.
- 🎥 **Movie Listings** – Fetch movies dynamically from **TMDB API**.
- 🎭 **Theater & Showtimes** – Auto-generated theaters and show timings.
- 🎟️ **Seat Selection** – Interactive seat layout with VIP, Master, and Normal seats.
- 💳 **Payment Page** – Simulated payment flow with booking confirmation.
- 🗄 **Database Integration** – Stores bookings linked with users.
- 📱 **Responsive UI** – Built using **Material-UI** with a clean design.

---

## 🛠️ Tech Stack

### Frontend
- React.js (with React Router DOM)
- Material-UI (MUI)
- Axios for API requests

### Backend
- Node.js + Express.js
- JWT Authentication
- REST API endpoints for authentication & bookings
- XAMPP and sql as Database

### Database
- MySQL with tables:
  - **users** → (id, name, email, phone, password, role)
  - **bookings** → (id, user_email, theater, movie, selected_seats, total_price, booking_time)

