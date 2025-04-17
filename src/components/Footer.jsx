import React from "react";
import { Box, Container, Grid, Typography, Link, IconButton, Divider, Tooltip } from "@mui/material";
import { Facebook, Twitter, YouTube } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      id="footer" // ✅ This enables scroll-to-footer
      sx={{
        backgroundColor: "#99BC85",
        color: "#fff",
        py: 5,
        px: 3,
        boxShadow: "0 -4px 12px rgba(0,0,0,0.1)",
        fontFamily: "'Josefin Sans', sans-serif",
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* About */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              About ThisisCinema
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
              ThisIsCinema is your one-stop platform to explore, book, and enjoy the latest movies with seamless seat selection, instant ticket confirmation, and beautiful UI.
            </Typography>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
              📍 Kurnool, India
              <br />
              📧 <Link href="mailto:ansarshaik2899@gmail.com" color="inherit" underline="hover">ansarshaik2899@gmail.com</Link>
              <br />
              📞 +91 7995182899
            </Typography>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Follow Us
            </Typography>
            <Box>
              <Tooltip title="YouTube">
                <IconButton
                  component="a"
                  href="https://www.youtube.com/watch?v=SI_PhNII7Mc"
                  target="_blank"
                  rel="noopener"
                  sx={{
                    color: "#fff",
                    mx: 0.5,
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.2)",
                      color: "#FDFAF6",
                    },
                  }}
                >
                  <YouTube />
                </IconButton>
              </Tooltip>
              <Tooltip title="X (Twitter)">
                <IconButton
                  component="a"
                  href="https://x.com/Ansar363666"
                  target="_blank"
                  rel="noopener"
                  sx={{
                    color: "#fff",
                    mx: 0.5,
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.2)",
                      color: "#FDFAF6",
                    },
                  }}
                >
                  <Twitter />
                </IconButton>
              </Tooltip>
              <Tooltip title="Facebook">
                <IconButton
                  component="a"
                  href="https://www.facebook.com/mohammed.ansar.7737769/"
                  target="_blank"
                  rel="noopener"
                  sx={{
                    color: "#fff",
                    mx: 0.5,
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.2)",
                      color: "#FDFAF6",
                    },
                  }}
                >
                  <Facebook />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: "#E4EFE7" }} />

        <Typography variant="body2" align="center" sx={{ opacity: 0.9 }}>
          © {new Date().getFullYear()} <strong>ThisIsCinema</strong>. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
