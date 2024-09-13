import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
     fontFamily: [
        "Poppins",
        "Roboto",
        "Helvetica",
        "Arial",
        "sans-serif",
     ].join(","),
     h1: {
        fontFamily: ["Poppins", "serif"].join(","),
        fontSize: "150px",
     },
     h2: {
        fontFamily: ["Poppins", "serif"].join(","),
        fontSize: "100px",
     },
     h3: {
        fontFamily: ["Poppins", "serif"].join(","),
        fontSize: "56px",
     },
     h4: {
        fontFamily: ["Poppins", "serif"].join(","),
        fontSize: "32px",
     },
     h5: {
        fontSize: "28px",
        letterSpacing: 4.75,
     },
     h6: {
        fontSize: "28px",
        fontFamily: ["Poppins", "serif"].join(","),
     },
     body1: {
        letterSpacing: 2.5,
        lineHeight: 1.65,
     },
     body2: {
        letterSpacing: 1.5,
        fontSize: "16px",
     },
     subtitle1: {
        fontSize: "14px",
        letterSpacing: 2.35,
     },
     subtitle2: {
        fontSize: "16px",
        letterSpacing: 2.7,
     },
  },
  palette: {
     primary: {
        main: "#0375FB",
     },
     secondary: {
        main: "#9C27B0",
     },
  
     text: {
      primary: "#333", 
      secondary: "#555", 
      disabled: "#888", 
    },
  },
  breakpoints: {
     values: {
        xs: 0,
        sm: 576,
        md: 768,
        lg: 1124,
        xl: 1920,
     },
  },
  components: {
   MuiContainer: {
     styleOverrides: {
       root: {
         '@media (min-width: 576px)': {
           paddingLeft: '0px',
           paddingRight: '0px',
         },
         '@media (min-width: 768px)': {
           paddingLeft: '0px',
           paddingRight: '0px',
         },
       },
     },
   },
 },
});

export default theme;
