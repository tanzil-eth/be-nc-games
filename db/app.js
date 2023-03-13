const express = require("express");
const app = express();
const apiRouter = require("../routers/api-router");
const handleErrors = require("../controllers/errorHandlers");
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleErrors);

module.exports = app;
