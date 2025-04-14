import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Typography,
    Paper,
    Tooltip,
    Divider,
} from "@mui/material";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import KingBedIcon from "@mui/icons-material/KingBed";
import StarRateIcon from "@mui/icons-material/StarRate";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

// 🔹 Random 3x3 corner gaps
const generateRandomCornerGaps = (rows, cols) => {
    const corners = ["TL", "TR", "BL", "BR"];
    const selected = corners.sort(() => 0.5 - Math.random()).slice(0, 2);
    const gaps = [];

    selected.forEach((corner) => {
        const rowStart = corner.includes("T") ? 0 : rows.length - 3;
        const colStart = corner.includes("L") ? 1 : cols - 3;
        for (let r = rowStart; r < rowStart + 3; r++) {
            for (let c = colStart; c < colStart + 3; c++) {
                gaps.push(`${rows[r]}${c}`);
            }
        }
    });

    return gaps;
};

// 🔹 Layout by theater
const getLayoutByTheater = (theater) => {
    switch (theater.toLowerCase()) {
        case "imax":
            return {
                rows: Array.from({ length: 15 }, (_, i) => String.fromCharCode(65 + i)),
                cols: 20,
                masterRows: ["O"],
                vipRows: ["N"],
                price: { normal: 250, master: 600, vip: 800 },
                aisleEvery: 5,
            };
        case "inox":
            return {
                rows: Array.from({ length: 12 }, (_, i) => String.fromCharCode(65 + i)),
                cols: 18,
                masterRows: ["L"],
                vipRows: ["K"],
                price: { normal: 180, master: 500, vip: 650 },
                aisleEvery: 4,
            };
        default:
            return {
                rows: Array.from({ length: 18 }, (_, i) => String.fromCharCode(65 + i)),
                cols: 22,
                masterRows: ["R"],
                vipRows: ["Q"],
                price: { normal: 200, master: 500, vip: 700 },
                aisleEvery: 6,
            };
    }
};

// 🔹 Seat Generator
const generateSeats = (layout, blockedSeats = []) => {
    const middleGap = [];
    const rowStart = Math.floor(layout.rows.length / 2) - 1;
    const colStart = Math.floor(layout.cols / 2) - 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 7; j++) {
            middleGap.push(`${layout.rows[rowStart + i]}${colStart + j}`);
        }
    }

    const verticalGapCol = Math.floor(layout.cols / 2); // Center divider
    const cornerGaps = generateRandomCornerGaps(layout.rows, layout.cols);
    const allGaps = new Set([...middleGap, ...cornerGaps]);

    let seats = [];
    layout.rows.forEach((row, rowIndex) => {
        let rowSeats = [];
        for (let col = 1; col <= layout.cols; col++) {
            if (col === verticalGapCol || allGaps.has(`${row}${col}`)) continue;

            const id = `${row}${col}`;
            const type = layout.masterRows.includes(row)
                ? "master"
                : layout.vipRows.includes(row)
                ? "vip"
                : "normal";
            rowSeats.push({
                id,
                row,
                col,
                type,
                price: layout.price[type],
                selected: false,
                blocked: blockedSeats.includes(id),
            });
        }
        seats.push(rowSeats);
        if ((rowIndex + 1) % layout.aisleEvery === 0) seats.push(null);
    });
    return seats;
};

const SeatSelection = () => {
    const { theater, time, date, movie } = useParams();
    const navigate = useNavigate();
    const storedMovie = localStorage.getItem("selectedMovie");
    const movieTitle = movie || storedMovie || "Unknown Movie";

    const [layout] = useState(getLayoutByTheater(theater));
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [blockedSeats, setBlockedSeats] = useState([]);

    useEffect(() => {
        const existingBlocked =
            JSON.parse(localStorage.getItem(`blockedSeats_${theater}_${date}_${time}`)) || [];
        setBlockedSeats(existingBlocked);
        setSeats(generateSeats(layout, existingBlocked));
    }, [layout, theater, date, time]);

    const toggleSeatSelection = (row, col) => {
        setSeats((prevSeats) =>
            prevSeats.map((seatRow) =>
                seatRow
                    ? seatRow.map((seat) =>
                          seat.row === row && seat.col === col && !seat.blocked
                              ? { ...seat, selected: !seat.selected }
                              : seat
                      )
                    : null
            )
        );

        setSelectedSeats((prevSelectedSeats) => {
            const id = `${row}${col}`;
            const exists = prevSelectedSeats.some((s) => s.id === id);
            if (exists) {
                return prevSelectedSeats.filter((s) => s.id !== id);
            } else {
                const seatObj = seats
                    .find((r) => r && r[0].row === row)
                    ?.find((s) => s.col === col);
                return seatObj ? [...prevSelectedSeats, seatObj] : prevSelectedSeats;
            }
        });
    };

    const totalAmount = selectedSeats.reduce((sum, seat) => sum + (seat?.price || 0), 0);

    const proceedToPayment = () => {
        if (!selectedSeats.length) {
            alert("⚠️ Please select at least one seat.");
            return;
        }

        const validSeats = selectedSeats.filter((seat) => seat && seat.id);
        const newBlocked = [...blockedSeats, ...validSeats.map((s) => s.id)];
        localStorage.setItem(
            `blockedSeats_${theater}_${date}_${time}`,
            JSON.stringify(newBlocked)
        );

        const bookingData = {
            movie: movieTitle,
            theater,
            selectedSeats: validSeats.map((seat) => ({
                id: seat.id,
                type: seat.type,
                price: seat.price,
            })),
            totalPrice: totalAmount,
            date,
            time,
            movie_date: date,
            movie_time: time,
            movie_day: new Date(date).toLocaleDateString("en-US", {
                weekday: "long",
            }),
        };

        localStorage.setItem("bookingDetails", JSON.stringify(bookingData));
        navigate("/payment");
    };

    return (
        <Box sx={{ backgroundColor: "#FAF1E6", minHeight: "100vh", padding: "20px", paddingTop: "80px" }}>
            <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", color: "#99BC85", mb: 2 }}>
                🎟️ {movieTitle} - {theater}
            </Typography>
            <Typography variant="h6" sx={{ textAlign: "center", color: "#2A3D45" }}>
                📅 {date} | ⏰ {time}
            </Typography>

            {/* 🔥 Fancy Screen This Way */}
            <Box sx={{ textAlign: "center", my: 3 }}>
                <Box
                    sx={{
                        background: "#222",
                        color: "#99BC85",
                        padding: "12px 30px",
                        borderRadius: "30px",
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        boxShadow: "0 0 20px #99BC85",
                        display: "inline-block",
                        border: "2px solid #99BC85",
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
                >
                    🎥 SCREEN THIS WAY
                </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                    {seats.map((rowSeats, rowIndex) =>
                        rowSeats ? (
                            <Box key={rowIndex} sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                <Typography sx={{ fontWeight: "bold", color: "#2A3D45", minWidth: "20px" }}>
                                    {rowSeats[0].row}
                                </Typography>
                                {rowSeats.map((seat) => (
                                    <Tooltip key={seat.id} title={`Seat: ${seat.id} | ₹${seat.price}`}>
                                        <Paper
                                            onClick={() =>
                                                !seat.blocked && toggleSeatSelection(seat.row, seat.col)
                                            }
                                            sx={{
                                                width: "24px",
                                                height: "24px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                borderRadius: "6px",
                                                cursor: seat.blocked ? "not-allowed" : "pointer",
                                                backgroundColor: seat.blocked
                                                    ? "#aaa"
                                                    : seat.selected
                                                    ? "#99BC85"
                                                    : "#FDFAF6",
                                                border: "1px solid",
                                                borderColor: seat.selected
                                                    ? "#7BA370"
                                                    : seat.blocked
                                                    ? "#555"
                                                    : "#99BC85",
                                                transition: "0.3s ease",
                                                "&:hover": {
                                                    backgroundColor: seat.blocked
                                                        ? "#aaa"
                                                        : seat.selected
                                                        ? "#99BC85"
                                                        : "#D5D8B5",
                                                },
                                            }}
                                        >
                                            {seat.type === "master" ? (
                                                <KingBedIcon fontSize="small" />
                                            ) : seat.type === "vip" ? (
                                                <StarRateIcon fontSize="small" />
                                            ) : (
                                                <EventSeatIcon fontSize="small" />
                                            )}
                                        </Paper>
                                    </Tooltip>
                                ))}
                            </Box>
                        ) : (
                            <Divider
                                key={`divider-${rowIndex}`}
                                sx={{
                                    width: "80%",
                                    my: "4px",
                                    backgroundColor: "#99BC85",
                                    height: "2px",
                                }}
                            />
                        )
                    )}
                </Box>

                {/* 🧾 Booking Summary */}
                <Paper
                    elevation={5}
                    sx={{
                        position: "fixed",
                        right: "20px",
                        top: "80px",
                        padding: "15px",
                        backgroundColor: "#FDFAF6",
                        borderRadius: "10px",
                    }}
                >
                    <Typography variant="h6">
                        <ShoppingCartIcon /> Your Booking
                    </Typography>
                    {selectedSeats.map((seat) => (
                        <Typography key={seat.id}>
                            {seat.id} - ₹{seat.price}
                        </Typography>
                    ))}
                    <Typography sx={{ fontWeight: "bold", mt: "10px" }}>Total: ₹{totalAmount}</Typography>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            backgroundColor: "#99BC85",
                            mt: 2,
                            "&:hover": { backgroundColor: "#7BA370" },
                        }}
                        onClick={proceedToPayment}
                    >
                        Continue to Payment
                    </Button>
                </Paper>
            </Box>
        </Box>
    );
};

export default SeatSelection;
