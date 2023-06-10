const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const historiesRoutes = require("./routes/histories");
const profileRoutes = require("./routes/profile");
const quotesRoutes = require("./routes/quotes");
const mlRoutes = require("./routes/ml");
const checkLanguage = require("./middlewares/checkLanguageMiddleware");

// For testing(Dont do In Production)
//const {admin, fbconf} = require("./config/firebase");

// Security Config
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors());

// Config Limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
});
app.use(limiter);

// Middleware Config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(checkLanguage);

// Routes
app.get("/", (req, res) => res.send("API RUN"));
app.get("/api/v1/", (req, res) => res.send("API RUN"));
app.get("/api/v1/documentation", (req, res) => res.redirect("https://documenter.getpostman.com/view/18201966/2s93m8xKWN"))
app.use("/api/v1", authRoutes );
app.use("/api/v1/histories", historiesRoutes );
app.use("/api/v1/profile", profileRoutes );
app.use("/api/v1/quotes", quotesRoutes );
app.use("/api/v1/ml", mlRoutes );

app.listen(process.env.PORT || 4000, () => {
    console.log("Server Running In Port: "+process.env.PORT);
    // Dont do In Production(To Check ENV in Cloud Run/GCP)
    //console.log(admin.apps.length)
    //console.log(fbconf)
    });
