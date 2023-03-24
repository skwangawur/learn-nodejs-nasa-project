const http = require("http");
require("dotenv").config();

const app = require("./app");
const { loadPlanetsData } = require("./models/planets.model");
const { mongoConnect } = require("./services/mongo");
const { loadLaunchData } = require("./models/launches.model");

// we sepate file of express and node server to make maintanable
const PORT = process.env.PORT || 8000;
console.log(process.env.PORT);
const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  // the reason why we put loadPlanetData in this file because we want input the habitable planet on the planets collection so when the api start and the front can direct to get the api planets
  await loadPlanetsData();
  await loadLaunchData();
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
