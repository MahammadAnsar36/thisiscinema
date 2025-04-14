import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import slide1 from "../assets/hero/slide1.jpg";
import slide2 from "../assets/hero/slide2.jpg";
import slide3 from "../assets/hero/slide3.jpg";
import { AuthContext } from "../context/AuthContext";

const slides = [
  {
    id: 1,
    image: slide1,
    title: "Experience Movies Like Never Before",
    text: "Watch the latest blockbusters in stunning quality!",
    button: "Book Your Tickets",
  },
  {
    id: 2,
    image: slide2,
    title: "Your Favorite Theaters Await!",
    text: "Select your city and find the best cinemas near you.",
    button: "Book Your Tickets",
  },
  {
    id: 3,
    image: slide3,
    title: "Exciting Offers Just for You!",
    text: "Get exclusive discounts on your movie tickets today.",
    button: "Book Your Tickets",
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { selectedCity } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const handleButtonClick = () => {
    if (selectedCity === "Select City") {
      setDialogOpen(true);
    } else {
      window.location.href = `/home/${selectedCity.toLowerCase()}`;
    }
  };

  return (
    <Box sx={styles.sliderContainer}>
      {slides.map((slide, index) => (
        <Box
          key={slide.id}
          sx={{
            ...styles.slide,
            backgroundImage: `url(${slide.image})`,
            transform: `translateX(${(index - currentSlide) * 100}%)`,
          }}
        >
          <Box sx={styles.overlay} />
          <Box sx={styles.content(isMobile)}>
            <Typography
              variant={isMobile ? "h5" : "h3"}
              sx={styles.title}
            >
              {slide.title}
            </Typography>
            <Typography
              variant="body1"
              sx={styles.text}
            >
              {slide.text}
            </Typography>
            <Button
              variant="contained"
              sx={styles.button}
              onClick={handleButtonClick}
            >
              {slide.button}
            </Button>
          </Box>
        </Box>
      ))}

      <IconButton onClick={prevSlide} sx={styles.leftArrow}>
        <ArrowBackIos sx={{ color: "#EFEFEF" }} />
      </IconButton>

      <IconButton onClick={nextSlide} sx={styles.rightArrow}>
        <ArrowForwardIos sx={{ color: "#EFEFEF" }} />
      </IconButton>

      <Box sx={styles.indicatorContainer}>
        {slides.map((_, index) => (
          <Box
            key={index}
            sx={{
              ...styles.indicator,
              backgroundColor: currentSlide === index ? "#EC5228" : "#EFEFEF",
            }}
          />
        ))}
      </Box>

      {/* 🔔 Alert Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: "bold", color: "#D32F2F" }}>
          📍 Please Select a City
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#555" }}>
            To continue booking, kindly select your city from the top navigation bar.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{
              backgroundColor: "#EC5228",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "8px",
              px: 3,
              "&:hover": {
                backgroundColor: "#c13f16",
              },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const styles = {
  sliderContainer: {
    position: "relative",
    width: "95%",
    height: { xs: "250px", sm: "350px" },
    margin: "80px auto 20px auto",
    overflow: "hidden",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
  },
  slide: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "20px",
    transition: "transform 0.8s ease-in-out",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0))",
    borderRadius: "20px",
  },
  content: (isMobile) => ({
    position: "absolute",
    bottom: isMobile ? "30px" : "50px",
    left: isMobile ? "20px" : "80px",
    right: "20px",
    color: "#EFEFEF",
    textAlign: "left",
    zIndex: 10,
  }),
  title: {
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#EFEFEF",
  },
  text: {
    fontSize: "1rem",
    marginBottom: "20px",
  },
  button: {
    backgroundColor: "#EC5228",
    color: "#EFEFEF",
    fontSize: "1rem",
    paddingX: 3,
    paddingY: 1,
    borderRadius: "8px",
    "&:hover": { backgroundColor: "#D44A24" },
  },
  leftArrow: {
    position: "absolute",
    top: "50%",
    left: "20px",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 10,
  },
  rightArrow: {
    position: "absolute",
    top: "50%",
    right: "20px",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 10,
  },
  indicatorContainer: {
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "8px",
    zIndex: 10,
  },
  indicator: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    transition: "background-color 0.3s ease",
  },
};

export default HeroSlider;
