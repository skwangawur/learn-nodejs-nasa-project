const express = require("express");
const app = require("../../app");
const launchesRouter = express.Router();
const {
  httpGetAllLaunches,
  httpPostNewLaunch,
  httpAbortLaunchById,
} = require("./launches.controller");

launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.post("/", httpPostNewLaunch);
launchesRouter.delete("/:id", httpAbortLaunchById);

module.exports = launchesRouter;
