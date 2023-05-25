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

// For testing(Dont do In Production)
//const {admin, fbconf} = require("./config/firebase");

// Security Config
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors());

// Config Limiter
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Middleware Config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => res.send("API RUN"));
app.use("/api/v1", authRoutes );
app.use("/api/v1/histories", historiesRoutes );
app.use("/api/v1/profile", profileRoutes );
app.use("/api/v1/quotes", quotesRoutes );

app.listen(process.env.PORT || 4000, () => {
    console.log("Server Running In Port: "+process.env.PORT);
    // Dont do In Production(To Check ENV in Cloud Run/GCP)
    //console.log(admin.apps.length)
    //console.log(fbconf)
    });