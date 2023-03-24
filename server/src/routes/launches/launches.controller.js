const {
  getAllLaunches,
  scheduleNewLaunch,
  existLaunchWithId,
  abortLaunchById,
} = require("../../models/launches.model");
const getPagination = require("../../services/pagination");

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = await getPagination(req.query);
  const { launchesData, launchesDataAmount } = await getAllLaunches(
    skip,
    limit
  );

  const hasNextPage =
    +launchesDataAmount - +req.query.page * 100 <= 0 ? false : true;

  return res.status(200).json({
    data: launchesData,
    amount: launchesDataAmount,
    page: req.query.page || 1,
    limit: req.query.limit || 100,
    hasNextPage,
  });
}

async function httpPostNewLaunch(req, res) {
  const launch = req.body;
  console.log(launch, "launch body");
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "launch property is missing!",
    });
  }

  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "invalid date",
    });
  }
  try {
    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
  } catch (error) {
    console.error(error);
  }
}

async function httpAbortLaunchById(req, res) {
  const launchId = Number(req.params.id);
  const existLaunch = await existLaunchWithId(launchId);
  if (existLaunch === null) {
    return res.status(400).json({
      error: "Launch not found",
    });
  }

  const aborted = await abortLaunchById(launchId);
  return res.status(200).json({
    message: "aborted succeed",
  });
}

module.exports = {
  httpGetAllLaunches,
  httpPostNewLaunch,
  httpAbortLaunchById,
};
