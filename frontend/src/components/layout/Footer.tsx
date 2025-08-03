import { Box, Container, Grid, Typography, IconButton, Button, Divider } from "@mui/material";
import { FaFacebook, FaInstagram, FaLinkedin, FaTiktok } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";

const aboutImages = [
  "src/assets/images/About1.jpg",
  "src/assets/images/About2.jpg",
  "src/assets/images/About3.jpg",
  "src/assets/images/About4.jpg",
  "src/assets/images/About5.jpg",
];

export default function Footer() {
  const [showMore, setShowMore] = useState(false);

  const handleToggle = () => {
    setShowMore((prev) => !prev);
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#1a1a2e",
        color: "#ffffff",
        padding: { xs: "2rem 0", md: "4rem 0" },
        marginTop: "4rem",
        width: "100%",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ 
              fontWeight: 600,
              color: "#e94560",
              mb: 2
            }}>
              About JCI Hammam Sousse
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {showMore ? (
                <>
                  Founded on August 30, 1983 and officially adopted on April 8, 1984,
                  JCI Hammam Sousse has been serving the local, national, and
                  international community based on the six points of the creed and
                  the four opportunities of the Junior Chamber (Individual,
                  Community, Internationalism, Business).
                </>
              ) : (
                "Founded in 1983, JCI Hammam Sousse is a leadership development organization creating positive change in the community."
              )}
            </Typography>
            <Button
              onClick={handleToggle}
              variant="outlined"
              size="small"
              sx={{
                color: "#ffffff",
                borderColor: "#e94560",
                '&:hover': {
                  backgroundColor: "#e94560",
                  borderColor: "#e94560"
                },
                mb: 2
              }}
            >
              {showMore ? "Show Less" : "Read More"}
            </Button>
            <Grid container spacing={1}>
              {aboutImages.map((image, index) => (
                <Grid item xs={4} sm={3} md={4} key={index}>
                  <Box
                    component="img"
                    src={image}
                    alt={`About ${index + 1}`}
                    sx={{
                      width: "100%",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "4px",
                      transition: "transform 0.3s",
                      '&:hover': {
                        transform: "scale(1.05)"
                      }
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Quick Links Section */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" gutterBottom sx={{ 
              fontWeight: 600,
              color: "#e94560",
              mb: 2
            }}>
              Quick Links
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", padding: 0 }}>
              <li>
                <Link to="/about" style={{ 
                  textDecoration: "none",
                  color: "#ffffff",
                  '&:hover': { color: "#e94560" }
                }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>About Us</Typography>
                </Link>
              </li>
              <li>
                <Link to="/events" style={{ textDecoration: "none", color: "#ffffff" }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>Events</Typography>
                </Link>
              </li>
              <li>
                <Link to="/projects" style={{ textDecoration: "none", color: "#ffffff" }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>Projects</Typography>
                </Link>
              </li>
              <li>
                <Link to="/membership" style={{ textDecoration: "none", color: "#ffffff" }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>Membership</Typography>
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ textDecoration: "none", color: "#ffffff" }}>
                  <Typography variant="body2">Contact</Typography>
                </Link>
              </li>
            </Box>
          </Grid>

          {/* Contact Section */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom sx={{ 
              fontWeight: 600,
              color: "#e94560",
              mb: 2
            }}>
              Contact Information
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Box component="span" sx={{ mr: 1 }}>📧</Box>
                Jci.hs.1983@gmail.com
              </Typography>
              <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Box component="span" sx={{ mr: 1 }}>📱</Box>
                +216 99 000 194
              </Typography>
              <Typography variant="body2" sx={{ display: "flex", alignItems: "flex-start" }}>
                <Box component="span" sx={{ mr: 1 }}>📍</Box>
                Rue Sidi Brahim, Maison des associations, 4011 Hammam Sousse, Tunisia
              </Typography>
            </Box>
          </Grid>

          {/* Social Media Section */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom sx={{ 
              fontWeight: 600,
              color: "#e94560",
              mb: 2
            }}>
              Follow Us
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Stay connected with our latest updates and events
            </Typography>
            <Box>
              <IconButton
                component="a"
                href="https://www.facebook.com/JCIHammamSousse"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: "#ffffff",
                  backgroundColor: "#4267B2",
                  mr: 1,
                  '&:hover': { backgroundColor: "#3b5998" }
                }}
              >
                <FaFacebook />
              </IconButton>
              <IconButton
                component="a"
                href="https://www.instagram.com/jci_hammamsousse"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: "#ffffff",
                  backgroundColor: "#C13584",
                  mr: 1,
                  '&:hover': { 
                    background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)" 
                  }
                }}
              >
                <FaInstagram />
              </IconButton>
              <IconButton
                component="a"
                href="https://www.linkedin.com/in/jcihammamsousse"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: "#ffffff",
                  backgroundColor: "#0077B5",
                  mr: 1,
                  '&:hover': { backgroundColor: "#006097" }
                }}
              >
                <FaLinkedin />
              </IconButton>
              <IconButton
                component="a"
                href="https://www.tiktok.com/@jcihammamsousse"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: "#ffffff",
                  backgroundColor: "#000000",
                  '&:hover': { backgroundColor: "#333333" }
                }}
              >
                <FaTiktok />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4, backgroundColor: "rgba(255,255,255,0.1)" }} />
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} JCI Hammam Sousse. All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
}