import { Box, Container, Grid, Typography, IconButton, Button } from "@mui/material";
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

const svgBackground = "src/assets/images/footer.png";

export default function Footer() {
  const [showMore, setShowMore] = useState(false); // State to manage text visibility

  const handleToggle = () => {
    setShowMore((prev) => !prev); // Toggle text visibility
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f4f7",
        padding: 4,
        marginTop: "60px", 
        backgroundImage: `url(${svgBackground})`,
        backgroundSize: "cover", 
        backgroundRepeat: "no-repeat", 
        backgroundPosition: "bottom center", 
        width: "100%", 
        position: "relative", 
      }}
    >
      <Container>
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2" gutterBottom>
              {showMore ? (
                <> 
                  PRÉSENTATION DE LA JCI HAMMAM SOUSSE Crée le 30 Août 1983 et
                  adopté officiellement le 08/04/1984, lors de la 1ère réunion
                  trimestrielle à Sfax. Dès la nomination du président fondateur de
                  l’OLM d’Hammam Sousse Mr Mohamed DJEGHAM, la Jeune Chambre
                  Internationale de Hammam Sousse n’a cessé de servir la communauté
                  locale, nationale et internationale en se basant sur les six
                  points du crédo et les quatre opportunités de la Jeune Chambre
                  (Individu, Communauté, Internationalisme, Affaires)...
                  {/* Add more text here if needed */}
                </>
              ) : (
                <> 
                  PRÉSENTATION DE LA JCI HAMMAM SOUSSE Crée le 30 Août 1983 et
                  adopté officiellement le 08/04/1984...
                </>
              )}
            </Typography>
            <Button onClick={handleToggle}>
              {showMore ? "Show Less" : "Show More"}
            </Button>
            <Grid container spacing={1}>
              {aboutImages.map((image, index) => (
                <Grid item xs={6} sm={4} key={index}>
                  <img src={image} alt={`About ${index + 1}`} width="100%" />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Contact Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Email:</strong> Jci.hs.1983@gmail.com
              <br />
              <strong>Phone:</strong> +216 99 000 194
            </Typography>
            <Typography variant="body2">
              <strong>Address:</strong> Rue Sidi Brahim, maison des associations
              4011 Hammam Sousse
            </Typography>
          </Grid>

          {/* Social Media Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Box>
              <IconButton
                component={Link}
                to="https://www.facebook.com/JCIHammamSousse"
                sx={{ color: "#4267B2" }} // Facebook Blue
              >
                <FaFacebook />
              </IconButton>
              <IconButton
                component={Link}
                to="https://www.instagram.com/jci_hammamsousse"
                sx={{ color: "#C13584" }} // Instagram Gradient Pink
              >
                <FaInstagram />
              </IconButton>
              <IconButton
                component={Link}
                to="https://www.linkedin.com/in/jcihammamsousse"
                sx={{ color: "#0077B5" }} // LinkedIn Blue
              >
                <FaLinkedin />
              </IconButton>
              <IconButton
                component={Link}
                to="https://www.tiktok.com/@jcihammamsousse"
                sx={{ color: "#000000" }} // TikTok Black
              >
                <FaTiktok />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
