const launches = require("./launches.mongo");
const planets = require("./planets.mongo");
const axios = require("axios");

// const launches = new Map();
const DEFAULT_LATEST_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

// launches.set(launch.flightNumber, launch);

async function saveLaunch(launch) {
  return await launches.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function getAllLaunches(skip, limit) {
  // return Array.from(launches.values());

  const launchesData = await launches
    .find(
      {},
      {
        _id: 0,
        __v: 0,
      }
    )
    .skip(skip)
    .limit(limit)
    .sort({
      flightNumber: 1,
    });
  const launchesDataAmount = await launches.count();

  return { launchesData, launchesDataAmount };
}

async function getLatestFlightNumber() {
  const latestLaunch = await launches.findOne().sort("-flightNumber");

  if (!latestLaunch) {
    return DEFAULT_LATEST_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet) {
    throw new Error("no matching planet found");
  }
  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    upcoming: true,
    successs: true,
    customers: ["ZTM", "NASA"],
  });

  await saveLaunch(newLaunch);
}

const SPACEX_ENDPOINT = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
  console.log("Downloading spaceX launch data...");
  const response = await axios.post(SPACEX_ENDPOINT, {
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            name: 1,
          },
        },
      ],
    },
  });

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc.payloads;
    const customers = payloads.flatMap((payload) => payload.name);
    const launch = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc.date_local,
      success: launchDoc.success,
      upcoming: launchDoc.upcoming,
      customers,
    };
    console.log(`${launch.flightNumber} ${launch.mission}`);
    await saveLaunch(launch);
  }
}

async function loadLaunchData() {
  const firstLaunches = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunches) {
    console.log("Launch data already loaded!");
  } else {
    await populateLaunches();
  }
}

function addNewLaunch(launch) {
  latesLaunchFlightNumber++;
  launches.set(
    latesLaunchFlightNumber,
    Object.assign(launch, {
      flightNumber: latesLaunchFlightNumber,
      upcoming: true,
      successs: true,
      customers: ["ZTM", "NASA"],
    })
  );
}

async function abortLaunchById(launchId) {
  return await launches.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  // const aborted = launches.get(launchId);
  // aborted.upcoming = false;
  // aborted.success = false;
  // return aborted;
}

async function findLaunch(filter) {
  return await launches.findOne(filter);
}

async function existLaunchWithId(launchId) {
  // return launches.has(launchId);
  return await findLaunch({
    flightNumber: launchId,
  });
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  scheduleNewLaunch,
  existLaunchWithId,
  abortLaunchById,
  loadLaunchData,
};
