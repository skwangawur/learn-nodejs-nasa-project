//make separated file to make code more efficient and not repeat to writer mongo connection in test and in a server
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once("open", () => {
  console.log("mongo db connected");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  mongoose.connect(MONGO_URL);
}

async function mongoDisConnect() {
  mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisConnect,
};
