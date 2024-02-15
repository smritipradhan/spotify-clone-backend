const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const songRoutes = require("./routes/songRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// database connections
const dbURI = process.env.DB;
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => app.listen(8080))
  .catch((err) => console.log(err));

// routes
app.use(authRoutes);
app.use(songRoutes);
