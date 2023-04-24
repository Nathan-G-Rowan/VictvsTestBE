const app = require("../app/app");

const db = require("../db/connection");
const seed = require("../db/seed");

const testData = require("../db/data/");
const request = require("supertest");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: returns response", () => {
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

describe("GET /api/exams", () => {
  describe("basic functionality", () => {
    test("200: returns exams array", () => {
      return request(app)
        .get("/api/exams")
        .expect(200)
        .then(({ body: { exams } }) => {
          expect(Array.isArray(exams)).toBe(true);
          exams.forEach((exam) => {
            expect(exam).toEqual(
              expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String),
                description: expect.any(String),
                date: expect.any(String),
                candidate_id: expect.any(Number),
                location_name: expect.any(String),
                latitude: expect.any(Number),
                longitude: expect.any(Number),
              })
            );
          });
        });
    });
    test("200: exams array is date ordered", () => {
      return request(app)
        .get("/api/exams")
        .expect(200)
        .then(({ body: { exams } }) => {
          console.log(exams);
          expect(exams).toBeSortedBy("date");
        });
    });
  });
  describe("filter queries", () => {
    test("200: filter by date", () => {
        return request(app)
          
      });
  });
});
