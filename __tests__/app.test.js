const app = require("../app/app");

const db = require("../db/connection");
const seed = require("../db/seed");

const testData = require("../db/data/");
const request = require("supertest");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /", () => {
  test("200: returns response", () => {
    return request(app).get("/").expect(200);
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

describe("GET /exams", () => {
  describe("basic functionality", () => {
    test("200: returns exams array", () => {
      return request(app)
        .get("/exams")
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
                candidate_name: expect.any(String),
                location: expect.any(String),
                latitude: expect.any(Number),
                longitude: expect.any(Number),
              })
            );
          });
        });
    });
    test("200: exams array is date ordered", () => {
      return request(app)
        .get("/exams")
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
          .get("/exams?date=17-06-2023")
          .expect(200)
          .then(({ body: { exams } }) => {
            expect(exams.length).toBe(1);
            expect(exams[0]).toEqual({
              id: 19,
              title: "VICTVS19",
              description: "VICTVS Exam 19",
              candidate_id: 1,
              candidate_name: "Wilmers",
              date: "2023-06-17T15:30:00.000Z",
              location: "London",
              latitude: 51.514427,
              longitude: -0.072081864,
            });
          });
      });
      test("200: responds with filtered entries in XXXX-XX-XX format", () => {
        return request(app)
          .get("/exams?date=2023-06-17")
          .expect(200)
          .then(({ body: { exams } }) => {
            expect(exams.length).toBe(1);
            expect(exams[0]).toEqual({
              id: 19,
              title: "VICTVS19",
              description: "VICTVS Exam 19",
              candidate_id: 1,
              candidate_name: "Wilmers",
              date: "2023-06-17T15:30:00.000Z",
              location: "London",
              latitude: 51.514427,
              longitude: -0.072081864,
            });
          });
      });
      test("200: dates that don't show up in the database returns an empty array", () => {
        return request(app)
          .get("/exams?date=9999-12-31")
          .expect(200)
          .then(({ body: { exams } }) => {
            expect(exams.length).toBe(0);
          });
      });
      test("400: date query does not allow non yyyy-mm-dd or dd-mm-yyyy query", () => {
        return request(app)
          .get("/exams?date='; DROP TABLE exams;'")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
          });
      });
      test("400: date query does not allow mm-dd-yyyy query", () => {
        return request(app)
          .get("/exams?date=12-31-2023")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
          });
      });
    });
    describe("filter by candidate", () => {
      test("200: only responds with exams including the right candidate", () => {
        return request(app)
          .get("/exams?candidate=1")
          .expect(200)
          .then(({ body: { exams } }) => {
            expect(exams.length).toBe(14);
          });
      });
      test("200: returns empty array when given a non-existent id", () => {
        return request(app)
          .get("/exams?candidate=100000")
          .expect(200)
          .then(({ body: { exams } }) => {
            expect(exams.length).toBe(0);
          });
      });
      test("400: does not allow non-number queries", () => {
        return request(app)
          .get("/exams?candidate=john")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
          });
      });
    });
    describe("filter by location", () => {
      test("200: only responds with exams including the right location", () => {
        return request(app)
          .get("/exams?location=London")
          .expect(200)
          .then(({ body: { exams } }) => {
            expect(exams.length).toBe(11);
          });
      });
      test("200: responds with empty array when the location isnt attached to any exams", () => {
        return request(app)
          .get("/exams?location=Gallifrey")
          .expect(200)
          .then(({ body: { exams } }) => {
            expect(exams.length).toBe(0);
          });
      });
      test("200: ignores case", () => {
        return request(app)
          .get("/exams?location=lOnDoN")
          .expect(200)
          .then(({ body: { exams } }) => {
            expect(exams.length).toBe(11);
          });
      });
      test("200: restricts SQL injection", () => {
        return request(app)
          .get("/exams?location=London AND WHERE nonexistentcolumn = 'sponge'")
          .expect(200)
          .then(({ body: { exams } }) => {
            expect(exams.length).toBe(0);
          });
      });
    });
    describe("filter by multiple aspects", () => {
      test("200: responds with select results from multiple fields", () => {
        return request(app)
          .get("/exams?date=05-05-2023&candidate=1&location=London")
          .expect(200)
          .then(({ body: { exams } }) => {
            expect(exams.length).toBe(9);
          });
      });
    });
  });
});
describe("POST /exams", () => {
  test("201: responds with the newly created exam", () => {
    return request(app)
      .post("/exams")
      .expect(201)
      .send({
        Title: "VICTVS Test",
        Description: "A test posted exam",
        Candidateid: 3,
        Date: "31/12/2023 15:30:00",
        LocationName: "Montreal",
        Latitude: 45.5019,
        Longitude: 73.5674,
      })
      .then(({ body: { exam } }) => {
        expect(exam).toEqual({
          id: 21,
          title: "VICTVS Test",
          description: "A test posted exam",
          candidate_id: 3,
          date: "2023-12-31T15:30:00.000Z",
          location: "Montreal",
          latitude: 45.5019,
          longitude: 73.5674,
        });
      });
  });
  test("201: new exam exists in the database", () => {
    return request(app)
      .post("/exams")
      .expect(201)
      .send({
        Title: "VICTVS Test",
        Description: "A test posted exam",
        Candidateid: 3,
        Date: "31/12/2023 15:30:00",
        LocationName: "Montreal",
        Latitude: 45.5019,
        Longitude: 73.5674,
      })
      .then(() => {
        return db.query(`SELECT * FROM exams WHERE id = 21;`);
      })
      .then(({ rows }) => {
        expect(rows[0]).toEqual({
          id: 21,
          title: "VICTVS Test",
          description: "A test posted exam",
          candidate_id: 3,
          date: expect.any(Date),
          location: "Montreal",
          latitude: 45.5019,
          longitude: 73.5674,
        });
      });
  });
  test("400: does not allow incomplete entry", () => {
    return request(app).post("/exams").expect(400).send({
      Description: "A test posted exam",
      LocationName: "Montreal",
      Latitude: 45.5019,
      Longitude: 73.5674,
    });
  });
  test("400: does not allow non-existent candidate", () => {
    return request(app).post("/exams").expect(400).send({
      Title: "VICTVS Test",
      Description: "A test posted exam",
      Candidateid: 1000000,
      Date: "31/12/2023 15:30:00",
      LocationName: "Montreal",
      Latitude: 45.5019,
      Longitude: 73.5674,
    });
  });
  test("400: does not allow invalid dates", () => {
    return request(app).post("/exams").expect(400).send({
      Title: "VICTVS Test",
      Description: "A test posted exam",
      Candidateid: 3,
      Date: "12/31/2023 15:30:00",
      LocationName: "Montreal",
      Latitude: 45.5019,
      Longitude: 73.5674,
    });
  });
  test("400: does not allow non-number langitude or longitude", () => {
    return request(app).post("/exams").expect(400).send({
      Title: "VICTVS Test",
      Description: "A test posted exam",
      Candidateid: 3,
      Date: "31/12/2023 15:30:00",
      LocationName: "Montreal",
      Latitude: "Montreal",
      Longitude: "Montreal",
    });
  });
  test("400: does not allow invalid latitude", () => {
    return request(app).post("/exams").expect(400).send({
      Title: "VICTVS Test",
      Description: "A test posted exam",
      Candidateid: 3,
      Date: "31/12/2023 15:30:00",
      LocationName: "Montreal",
      Latitude: 1000000,
      Longitude: 73.5674,
    });
  });
  test("400: does not allow invalid longitude", () => {
    return request(app).post("/exams").expect(400).send({
      Title: "VICTVS Test",
      Description: "A test posted exam",
      Candidateid: 3,
      Date: "31/12/2023 15:30:00",
      LocationName: "Montreal",
      Latitude: 45.5019,
      Longitude: 1000000,
    });
  });
});

describe("GET /candidates", () => {
  test("200: retrieves a list of all candidates", () => {
    return request(app)
      .get("/candidates")
      .expect(200)
      .then(({ body: { candidates } }) => {
        expect(Array.isArray(candidates)).toBe(true);
        expect(candidates.length).toBe(4);
        candidates.forEach((candidate) => {
          expect(candidate).toEqual(
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
            })
          );
        });
      });
  });
});
describe("POST /candidates", () => {
  test("201: returns the new candidate", () => {
    return request(app)
      .post("/candidates")
      .expect(201)
      .send({
        name: "bruce",
      })
      .then(({ body: { candidate } }) => {
        expect(candidate).toEqual({
          id: 5,
          name: "bruce",
        });
      });
  });
  test("201: the new candidate is in the database", () => {
    return request(app)
      .post("/candidates")
      .expect(201)
      .send({
        name: "bruce",
      })
      .then(() => {
        return db.query(`SELECT * FROM candidates WHERE name = 'bruce';`);
      })
      .then(({ rows }) => {
        expect(rows[0]).toEqual({
          id: 5,
          name: "bruce",
        });
      });
  });
  test("400: does not allow the name field to be left blank", () => {
    return request(app).post("/candidates").expect(400).send({});
  });
});
