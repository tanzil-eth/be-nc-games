const express = require("express");
const app = express();
const apiRouter = require("../routers/api-router");
const handleErrors = require("../controllers/errorHandlers");

app.use("/api", apiRouter);

app.use(handleErrors);

module.exports = app;
