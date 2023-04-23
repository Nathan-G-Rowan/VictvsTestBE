const db = require("./connection");
const format = require("pg-format");

const seed = async ({ candidateData }) => {
  await db.query(`DROP TABLE IF EXISTS exams;`);
  await db.query(`DROP TABLE IF EXISTS candidates;`);

  await db.query(`
    CREATE TABLE candidates (
      id SERIAL PRIMARY KEY,
      Name VARCHAR NOT NULL
    );`);

  await db.query(`
    CREATE TABLE exams (
      id SERIAL PRIMARY KEY,
      Title VARCHAR NOT NULL,
      Candidateid INTEGER NOT NULL REFERENCES candidates(id),
      Date TIMESTAMP NOT NULL,
      LocationName VARCHAR NOT NULL,
      Latitude REAL NOT NULL,
      Longitude REAL NOT NULL
    );`);

  const insertCandidatesQuery = format(
    "INSERT INTO candidates (Name) VALUES %L RETURNING *;",
    candidateData.map(({ Name }) => [Name])
  );
  await db.query(insertCandidatesQuery);

  const insertExamsQuery = format(
    "INSERT INTO candidates (Name) VALUES %L RETURNING *;",
    candidateData.map(({ Name }) => [Name])
  );
  await db.query(insertExamsQuery);
};

module.exports = seed;
