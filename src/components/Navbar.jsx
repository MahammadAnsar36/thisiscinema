import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme,
  Divider,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import logo from "../assets/logo.png";

const cities = ["Hyderabad", "Mumbai", "Delhi", "Chennai", "Kolkata", "Bangalore"];

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [cityAnchorEl, setCityAnchorEl] = useState(null);
  const [userAnchorEl, setUserAnchorEl] = useState(null);
  const [selectedCity, setSelectedCity] = useState("Select City");
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const storedCity = localStorage.getItem("selectedCity");
    if (storedCity) setSelectedCity(storedCity);
  }, []);

  const handleCityMenuOpen = (event) => {
    setCityAnchorEl(event.currentTarget);
    setUserAnchorEl(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserAnchorEl(event.currentTarget);
    setCityAnchorEl(null);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    localStorage.setItem("selectedCity", city);
    setCityAnchorEl(null);
    navigate(`/home/${city.toLowerCase()}`);
  };

  const handleMenuClose = () => {
    setCityAnchorEl(null);
    setUserAnchorEl(null);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const scrollToFooter = () => {
    const footer = document.getElementById("footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#3F7D58",
        width: "100%",
        fontFamily: "Josefin Sans",
        zIndex: 1300,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingX: 2,
        }}
      >
        {/* Logo */}
        <Box
          onClick={() => navigate("/")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            cursor: "pointer",
          }}
        >
          <img src={logo} alt="logo" style={{ height: 45, borderRadius: "50%" }} />
          <Typography variant="h5" sx={{ color: "#EFEFEF", fontWeight: "bold" }}>
            ThisIsCinema
          </Typography>
        </Box>

        {/* Desktop Menu */}
        {!isMobile ? (
          <>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Button
                variant="contained"
                onClick={handleCityMenuOpen}
                sx={{
                  backgroundColor: "#EF9651",
                  color: "#3F7D58",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  px: 3,
                  borderRadius: "20px",
                  "&:hover": {
                    backgroundColor: "#EC5228",
                    color: "#EFEFEF",
                  },
                }}
              >
                {selectedCity === "Select City" ? "Select City" : `📍 ${selectedCity}`}
              </Button>

              <Menu
                anchorEl={cityAnchorEl}
                open={Boolean(cityAnchorEl)}
                onClose={handleMenuClose}
                sx={{
                  "& .MuiPaper-root": {
                    backgroundColor: "#FAF1E6",
                    color: "#3F7D58",
                    borderRadius: "10px",
                    padding: "5px",
                  },
                }}
              >
                {cities.map((city, i) => (
                  <MenuItem
                    key={i}
                    onClick={() => handleCitySelect(city)}
                    sx={{
                      fontWeight: "bold",
                      padding: "10px 20px",
                      "&:hover": {
                        backgroundColor: "#99BC85",
                        color: "#fff",
                      },
                    }}
                  >
                    {city}
                  </MenuItem>
                ))}
              </Menu>

              <Button component={Link} to="/" sx={navLinkStyle}>Home</Button>
              <Button onClick={scrollToFooter} sx={navLinkStyle}>About Us</Button>
              <Button onClick={scrollToFooter} sx={navLinkStyle}>Contact Us</Button>
            </Box>

            {/* User Section */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {user ? (
                <>
                  <Typography sx={{ color: "#EFEFEF", fontWeight: "bold" }}>
                    Welcome {user.name}
                  </Typography>
                  <Tooltip title="User Info">
                    <IconButton onClick={handleUserMenuOpen} sx={{ color: "#EFEFEF" }}>
                      <AccountCircle sx={{ fontSize: 32 }} />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={userAnchorEl}
                    open={Boolean(userAnchorEl)}
                    onClose={handleMenuClose}
                    sx={{
                      "& .MuiPaper-root": {
                        backgroundColor: "#FAF1E6",
                        color: "#3F7D58",
                        borderRadius: "10px",
                        padding: "5px",
                        minWidth: 220,
                      },
                    }}
                  >
                    <Box sx={{ padding: "10px 16px", fontSize: "0.95rem" }}>
                      <Typography><strong>Name:</strong> {user.name}</Typography>
                      <Typography><strong>Email:</strong> {user.email}</Typography>
                      <Typography><strong>Phone:</strong> {user.phone}</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <MenuItem
                      onClick={logout}
                      sx={{
                        color: "#EC5228",
                        fontWeight: "bold",
                        justifyContent: "center",
                      }}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/signin"
                    variant="contained"
                    sx={authButtonStyle("#EC5228", "#EFEFEF", "#EF9651", "#3F7D58")}
                  >
                    SIGN IN
                  </Button>
                  <Button
                    component={Link}
                    to="/signup"
                    variant="contained"
                    sx={authButtonStyle("#EF9651", "#3F7D58", "#EC5228", "#EFEFEF")}
                  >
                    SIGN UP
                  </Button>
                </>
              )}
            </Box>
          </>
        ) : (
          <>
            <IconButton onClick={toggleDrawer(true)} sx={{ color: "#EFEFEF" }}>
              <MenuIcon sx={{ fontSize: 30 }} />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
              <Box sx={{ width: 260, p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                  📍 {selectedCity}
                </Typography>

                <List>
                  <ListItem>
                    <Button onClick={handleCityMenuOpen} fullWidth sx={drawerBtnStyle}>
                      Change City
                    </Button>
                  </ListItem>
                  <ListItem button component={Link} to="/" onClick={toggleDrawer(false)}>
                    <ListItemText primary="Home" />
                  </ListItem>
                  <ListItem button onClick={() => { scrollToFooter(); setDrawerOpen(false); }}>
                    <ListItemText primary="About Us" />
                  </ListItem>
                  <ListItem button onClick={() => { scrollToFooter(); setDrawerOpen(false); }}>
                    <ListItemText primary="Contact Us" />
                  </ListItem>

                  <Divider sx={{ my: 1 }} />

                  {user ? (
                    <>
                      <Box sx={{ px: 2 }}>
                        <Typography><strong>Name:</strong> {user.name}</Typography>
                        <Typography><strong>Email:</strong> {user.email}</Typography>
                        <Typography><strong>Phone:</strong> {user.phone}</Typography>
                      </Box>
                      <ListItem button onClick={logout}>
                        <ListItemText
                          primary="Logout"
                          sx={{ color: "#EC5228", fontWeight: "bold", textAlign: "center" }}
                        />
                      </ListItem>
                    </>
                  ) : (
                    <>
                      <ListItem button component={Link} to="/signin" onClick={toggleDrawer(false)}>
                        <ListItemText primary="SIGN IN" />
                      </ListItem>
                      <ListItem button component={Link} to="/signup" onClick={toggleDrawer(false)}>
                        <ListItemText primary="SIGN UP" />
                      </ListItem>
                    </>
                  )}
                </List>
              </Box>
            </Drawer>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

// Styles
const navLinkStyle = {
  color: "#EFEFEF",
  fontWeight: "bold",
  fontSize: "1rem",
  textTransform: "capitalize",
  position: "relative",
  "&:hover": {
    color: "#EF9651",
    "&::after": {
      content: '""',
      position: "absolute",
      left: "50%",
      bottom: "-5px",
      width: "60%",
      height: "2px",
      backgroundColor: "#EF9651",
      transform: "translateX(-50%)",
    },
  },
};

const drawerBtnStyle = {
  backgroundColor: "#EF9651",
  color: "#3F7D58",
  fontWeight: "bold",
  borderRadius: "20px",
  "&:hover": { backgroundColor: "#EC5228", color: "#fff" },
};

const authButtonStyle = (bg, color, hoverBg, hoverColor) => ({
  backgroundColor: bg,
  color,
  fontWeight: "bold",
  paddingX: 3,
  "&:hover": {
    backgroundColor: hoverBg,
    color: hoverColor,
  },
});

export default Navbar;
