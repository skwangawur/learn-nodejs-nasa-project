const express = require("express");
const { httpGetAllPlanets } = require("./planets.constroller");

const planetsRouter = express.Router();

planetsRouter.get("/", httpGetAllPlanets);

module.exports = planetsRouter;
