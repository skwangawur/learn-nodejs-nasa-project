const express = require("express");
const api = express.Router();

const planetsRouter = require("./planest/planets.router");
const launchesRouter = require("./launches/launches.router");

api.use("/planets", planetsRouter);
api.use("/launches", launchesRouter);

module.exports = api;
