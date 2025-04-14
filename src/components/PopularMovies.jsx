import React from "react";
import { Box, Card, CardMedia, CardContent, Typography } from "@mui/material";

const PopularMovies = ({ movies }) => {
    return (
        <Box sx={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
            {movies.length === 0 ? (
                <Typography variant="h6">No movies available</Typography>
            ) : (
                movies.map((movie) => (
                    <Card key={movie.id} sx={{ width: "250px", boxShadow: "3px 3px 10px rgba(0,0,0,0.2)" }}>
                        <CardMedia component="img" height="300" image={movie.poster} alt={movie.title} />
                        <CardContent>
                            <Typography variant="h6">{movie.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {movie.genre} | {movie.duration} min
                            </Typography>
                        </CardContent>
                    </Card>
                ))
            )}
        </Box>
    );
};

export default PopularMovies;
