// Package Imports
const express = require("express");
const cors = require("cors");

// Custom Imports
const logger = require("./utils/log");
const DB = require("./utils/db");
const globalErrorHandler = require("./utils/error/globalError");
const routes = require("./routers/index");

const app = express();
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

const whiteList = ["http://localhost:4200", "http://localhost:8080"];
const corsOptions = {
  origin: (origin, cb) => {
    if (whiteList.indexOf(origin) !== 1) {
      return cb(undefined, true);
    }
  },
};

app.use(cors());

// Open DB connection
DB.openDBConnection();

// Routing
routes(app);

//global error
app.use(globalErrorHandler);

module.exports = app;
