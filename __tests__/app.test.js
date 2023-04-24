const app = require("../app/app");

const db = require("../db/connection");
const seed = require("../db/seed");

const testData = require("../db/data/");
const request = require("supertest");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: returns response object", () => {
    return request(app).get("/api").expect(200);
  });
});

describe("404 response", () => {
  test("404: returns error object", () => {
    return request(app)
      .get("/missing_directory")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("path not found");
      });
  });
});
