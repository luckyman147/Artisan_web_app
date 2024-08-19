// service.js

const express = require("express");
const session = require("express-session");
const passport = require("passport");

const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const errorHandler = require("./middlewares/error");
const initializePassport = require("./models/passportConfig");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
initializePassport();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());

app.use(passport.session());
// Routes

app.use("/api/auth", authRoutes);
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login"); // Redirect to login if not authenticated
};
// Error Handling Middleware
app.use(errorHandler);
app.get("/", isAuthenticated, (req, res) => {
  res.json(req.user); // Send the user information as JSON
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
