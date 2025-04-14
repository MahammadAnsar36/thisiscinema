import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Grid, Paper, CircularProgress } from "@mui/material";

const API_KEY = "bfe9cce63f5e42b7c67b220cc1d6c00f";
const BASE_URL = "https://api.themoviedb.org/3";

// 🎭 Generate random showtimes
const generateShowtimes = () => {
    const allTimes = [
        "09:00 AM", "10:30 AM", "12:00 PM", "01:30 PM", "03:00 PM",
        "04:30 PM", "06:00 PM", "07:30 PM", "09:00 PM", "10:30 PM"
    ];
    return allTimes.sort(() => Math.random() - 0.5).slice(4, 8);
};

// 📍 Get or generate theaters dynamically per movie & date
const getOrGenerateTheaters = (movieId, date) => {
    const storageKey = `theaters-${movieId}-${date}`;
    const storedTheaters = localStorage.getItem(storageKey);
    
    if (storedTheaters) return JSON.parse(storedTheaters);

    const allTheaters = [
        "PVR Cinemas", "INOX", "Cinepolis", "Carnival Cinemas", "Miraj Cinemas", "Wave Cinemas",
        "Movietime Cinemas", "Rajhans Cinemas", "SRS Cinemas", "Maxus Cinemas", "City Pride", "E Square",
        "Gold Cinema", "Fun Cinemas"
    ];

    const shuffledTheaters = allTheaters.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 5) + 6);

    const theaters = shuffledTheaters.map(name => ({
        name,
        showtimes: generateShowtimes()
    }));

    localStorage.setItem(storageKey, JSON.stringify(theaters));
    return theaters;
};

// 📅 Get next 7 days
const getDates = () => {
    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return {
            fullDate: date.toDateString(),
            day: date.toLocaleDateString("en-US", { weekday: "short" }),
            dateNum: date.getDate(),
            month: date.toLocaleDateString("en-US", { month: "short" })
        };
    });
};

const BookTickets = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [theaters, setTheaters] = useState([]);
    const [selectedDate, setSelectedDate] = useState(getDates()[0].fullDate);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
                const data = await res.json();
                setMovie(data);
                setTheaters(getOrGenerateTheaters(id, selectedDate));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching movie details:", error);
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id, selectedDate]);

    // 🎟️ Disable past showtimes for today
    const getUpdatedShowtimes = (showtimes) => {
        const today = getDates()[0].fullDate; 
        if (selectedDate !== today) return showtimes.map(time => ({ time, disabled: false }));

        const currentTime = new Date();

        return showtimes.map((time) => {
            const [hour, minutes, period] = time.match(/(\d+):(\d+) (\w+)/).slice(1);
            let showTime = new Date();
            showTime.setHours(period === "PM" && hour !== "12" ? parseInt(hour) + 12 : parseInt(hour) % 12);
            showTime.setMinutes(parseInt(minutes));
            showTime.setSeconds(0);

            return { time, disabled: showTime <= currentTime };
        });
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                <CircularProgress sx={{ color: "#99BC85" }} />
            </Box>
        );
    }

    return (
        <Box sx={{ padding: "80px 20px", backgroundColor: "#FAF1E6", minHeight: "100vh" }}>
            {/* 🎬 Movie Title */}
            <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", color: "#99BC85", marginBottom: 3 }}>
                🎟️ Book Tickets for {movie.title}
            </Typography>

            {/* 📅 Sticky Date Selection */}
            <Box sx={{
                position: "sticky",
                top: "60px",
                zIndex: 1000,
                backgroundColor: "#FAF1E6",
                padding: "10px 0",
                borderBottom: "2px solid #99BC85",
                display: "flex",
                alignItems: "center",
                overflowX: "auto",
                gap: 1,
                minHeight: "50px"
            }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#2A3D45", paddingLeft: "10px" }}>
                    {getDates()[0].month}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {getDates().map(({ fullDate, day, dateNum }, index) => (
                        <Button
                            key={index}
                            onClick={() => {
                                setSelectedDate(fullDate);
                                setTheaters(getOrGenerateTheaters(id, fullDate));
                            }}
                            sx={{
                                backgroundColor: selectedDate === fullDate ? "#99BC85" : "#D5D8B5",
                                color: "#FFF",
                                fontWeight: "bold",
                                borderRadius: "10px",
                                padding: "10px",
                                minWidth: "60px",
                                textAlign: "center",
                                flexDirection: "column",
                                "&:hover": { backgroundColor: "#7BA370" }
                            }}
                        >
                            <Typography variant="h6">{dateNum}</Typography>
                            <Typography variant="caption">{day}</Typography>
                        </Button>
                    ))}
                </Box>
            </Box>

            {/* 🎭 Theaters List */}
            <Grid container spacing={3} justifyContent="center" sx={{ marginTop: "20px" }}>
                {theaters.map((theater, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper elevation={4} sx={{ padding: "20px", borderRadius: "12px", textAlign: "center" }}>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                {theater.name}
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2, marginTop: 2 }}>
                                {getUpdatedShowtimes(theater.showtimes).map(({ time, disabled }, i) => (
                                    <Button
                                        key={i}
                                        variant="outlined"
                                        disabled={disabled}
                                        sx={{
                                            borderColor: disabled ? "#D85C41" : "#99BC85",
                                            color: disabled ? "#D85C41" : "#99BC85",
                                            fontWeight: "bold",
                                            "&:hover": disabled ? {} : { backgroundColor: "#99BC85", color: "#FFF" }
                                        }}
                                        onClick={() => {
                                            if (!disabled) {
                                                localStorage.setItem("selectedMovie", movie.title); // ✅ Store Movie Name
                                                navigate(`/select-seats/${id}/${theater.name}/${time}/${selectedDate}`);
                                            }
                                        }}
                                    >
                                        {time}
                                    </Button>
                                ))}
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default BookTickets;
