const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisConnect } = require("../../services/mongo");

describe("Launch API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisConnect();
  });

  describe("Test GET /v1/v1/launches", () => {
    test("should respond with 200 success", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect("Content-type", /json/)
        .expect(200);
    });
  });

  describe("Test POST /v1/launches", () => {
    const launchData = {
      launchDate: "december 21, 2023",
      mission: "Kepler Exploration X",
      rocket: "Explorer IS1",
      target: "Kepler-442 b",
    };

    const launchDataWithInvalidDate = {
      launchDate: "invalid",
      mission: "Kepler Exploration X",
      rocket: "Explorer IS1",
      target: "Kepler-442 b",
    };

    const launchDataWithoutDate = {
      mission: "Kepler Exploration X",
      rocket: "Explorer IS1",
      target: "Kepler-442 b",
    };

    test("should responde with 200 success", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(launchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(requestDate).toBe(responseDate);

      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test("should catch missing launch properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "launch property is missing!",
      });
    });

    test("should catch invalid date", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "invalid date",
      });
    });
  });

  describe("test DELETE /v1/launches", () => {
    const launchId = 100;
    const invalidLaunchId = 1000;

    test("should respond launch.upcoming and launch.success to be false", async () => {
      const response = await request(app)
        .del(`/v1/launches/${launchId}`)
        .expect(200);

      expect(response.body.upcoming).toBeFalsy();
      expect(response.body.success).toBeFalsy();
    });

    test("should catch doest exist launch id", async () => {
      const response = await request(app)
        .del(`/v1/launches/${invalidLaunchId}`)
        .expect(400);

      expect(response.body).toMatchObject({
        error: "Launch not found",
      });
    });
  });
});
