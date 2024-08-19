import { BrowserRouter } from "react-router-dom";
import Navigation from "./routes/routes";

import { ThemeProvider  } from "@mui/material/styles";

import theme from "./utils/theme";

function App() {
  return (
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      </ThemeProvider>
  );
}

export default App;
