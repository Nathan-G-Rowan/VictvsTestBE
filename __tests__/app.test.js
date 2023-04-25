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
          expect(exams).toBeSortedBy("date");
        });
    });
  });
  describe("filter queries", () => {
    describe("filter by date", () => {
      test("200: responds with filtered entries in XX-XX-XXXX format", () => {
        return request(app)
          .get("/api/exams?date=17-06-2023")
          .expect(200)
          .then(({ body: { exams } }) => {
            expect(exams.length).toBe(1);
            expect(exams[0]).toEqual({
              id: 19,
              title: "VICTVS19",
              description: "VICTVS Exam 19",
              candidate_id: 1,
              date: "2023-06-17T15:30:00.000Z",
              location_name: "London",
              latitude: 51.514427,
              longitude: -0.072081864,
            });
          });
      });
      test("200: responds with filtered entries in XXXX-XX-XX format", () => {
        return request(app)
          .get("/api/exams?date=2023-06-17")
          .expect(200)
          .then(({ body: { exams } }) => {
            expect(exams.length).toBe(1);
            expect(exams[0]).toEqual({
              id: 19,
              title: "VICTVS19",
              description: "VICTVS Exam 19",
              candidate_id: 1,
              date: "2023-06-17T15:30:00.000Z",
              location_name: "London",
              latitude: 51.514427,
              longitude: -0.072081864,
            });
          });
      });
      test("200: dates that don't show up in the database returns an empty array", () => {
        return request(app)
          .get("/api/exams?date=9999-12-31")
          .expect(200)
          .then(({ body: { exams } }) => {
            expect(exams.length).toBe(0);
          });
      });
      test("200: date query does not allow data injection", () => {
        return request(app)
          .get("/api/exams?date='; DROP TABLE exams;'")
          .expect(200)
          .then(({ body: { exams } }) => {
            expect(exams.length).toBe(0);
          });
      });
    });
    describe("filter by candidate", () => {
      test("200: only responds with exams including the right candidate", () => {
        return request(app)
          .get("/api/exams?candidate=1")
          .expect(200)
          .then(({ body: { exams } }) => {
            expect(exams.length).toBe(14);
          });
      });
      test("200: returns empty array when given a non-existent id", () => {
        return request(app)
          .get("/api/exams?candidate=100000")
          .expect(200)
          .then(({ body: { exams } }) => {
            expect(exams.length).toBe(0);
          });
      });
      test("200: returns empty array when candidate value is not a number", () => {
        return request(app)
          .get("/api/exams?candidate=john")
          .expect(200)
          .then(({ body: { exams } }) => {
            expect(exams.length).toBe(0);
          });
      });
    });
    describe("filter by location", () => {
      test("200: only responds with exams including the right location", () => {
        return request(app)
          .get("/api/exams?location=London")
          .expect(200)
          .then(({ body: { exams } }) => {
            expect(exams.length).toBe(11);
          });
      });
      test("200: responds with empty array when the location isnt attached to any exams", () => {
        return request(app)
          .get("/api/exams?location=Gallifrey")
          .expect(200)
          .then(({ body: { exams } }) => {
            expect(exams.length).toBe(0);
          });
      });
      test("200: restricts SQL injection", () => {
        return request(app)
          .get(
            "/api/exams?location=London AND WHERE nonexistentcolumn = 'sponge'"
          )
          .expect(200)
          .then(({ body: { exams } }) => {
            expect(exams.length).toBe(0);
          });
      });
    });
    describe("filter by multiple aspects", () => {
      test("200: responds with select results from multiple fields", () => {
        return request(app)
          .get("/api/exams?date=05-05-2023&candidate=1&location=London")
          .expect(200)
          .then(({ body: { exams } }) => {
            expect(exams.length).toBe(9);
          });
      });
    });
  });
});
