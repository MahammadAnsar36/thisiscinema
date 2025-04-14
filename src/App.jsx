import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import AuthProvider, { AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // ✅ Footer remains at the bottom
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import MoviesPage from "./pages/MoviesPage";
import MovieDetails from "./pages/MovieDetails";
import BookTickets from "./pages/BookTickets";
import SeatSelection from "./pages/SeatSelection";
import Payment from "./pages/Payment";
import MyBookings from "./pages/MyBookings"; // ✅ Added MyBookings page

// 🔒 Protected Route Component
const ProtectedRoute = ({ element }) => {
  const { user } = useContext(AuthContext);
  return user ? element : <Navigate to="/signin" replace />;
};

const App = () => {
  useEffect(() => {
    document.title = "ThisIsCinema"; // ✅ Keeps the title consistent
  }, []);

  return (
    <AuthProvider>
      <Router>
        {/* 💡 Flex Layout ensures Footer stays at the bottom */}
        <Box display="flex" flexDirection="column" minHeight="100vh">
          <Navbar />
          
          {/* 💡 Routes wrapped inside a flexible Box */}
          <Box flexGrow={1} sx={{ paddingBottom: "20px" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/home/:city" element={<MoviesPage />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/book-tickets/:id" element={<ProtectedRoute element={<BookTickets />} />} />
              <Route path="/select-seats/:id/:theater/:time/:date" element={<ProtectedRoute element={<SeatSelection />} />} />
              <Route path="/payment" element={<ProtectedRoute element={<Payment />} />} />
              {/* <Route path="/my-bookings" element={<ProtectedRoute element={<MyBookings />} />} /> ✅ Added route */}
              <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
            </Routes>
          </Box>

          <Footer /> {/* ✅ Always at the bottom */}
        </Box>
      </Router>
    </AuthProvider>
  );
};

export default App;
