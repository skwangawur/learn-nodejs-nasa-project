const app = require("../../app");
const request = require("supertest");
const { loadPlanetsData } = require("../../models/planets.model");
const { mongoConnect, mongoDisConnect } = require("../../services/mongo");

describe("test GET /v1/planets", () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData();
  });

  afterAll(async () => {
    await mongoDisConnect();
  });

  test("should get 8 habitable planets", async () => {
    const response = await request(app)
      .get("/v1/planets")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toHaveLength(8);
  });
});
