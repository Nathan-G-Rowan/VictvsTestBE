const db = require("./connection");
const format = require("pg-format");

const seed = async ({ candidateData, examData }) => {
  let db_name;
  await db.query(`SELECT current_database();`).then(({ rows }) => {
    db_name = rows[0].current_database;
  });

  await db.query(`ALTER DATABASE ${db_name} SET datestyle TO 'ISO, european';`);

  await db.query(`DROP TABLE IF EXISTS exams;`);
  await db.query(`DROP TABLE IF EXISTS candidates;`);

  await db.query(`
    CREATE TABLE candidates (
      id SERIAL PRIMARY KEY,
      name VARCHAR NOT NULL
    );`);

  await db.query(`
    CREATE TABLE exams (
      id SERIAL PRIMARY KEY,
      title VARCHAR NOT NULL,
      description VARCHAR,
      candidate_id INTEGER NOT NULL REFERENCES candidates(id),
      date TIMESTAMP NOT NULL,
      location VARCHAR NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL
    );`);

  const insertCandidatesQuery = format(
    "INSERT INTO candidates (name) VALUES %L RETURNING *;",
    candidateData.map(({ Name }) => [Name])
  );
  await db.query(insertCandidatesQuery);

  const insertExamsQuery = format(
    "INSERT INTO exams (title, description, candidate_id, date, location, latitude, longitude) VALUES %L RETURNING *;",
    examData.map(
      ({
        Title,
        Description,
        Candidateid,
        Date,
        LocationName,
        Latitude,
        Longitude,
      }) => [
        Title,
        Description,
        Candidateid,
        Date,
        LocationName,
        Latitude,
        Longitude,
      ]
    )
  );
  await db.query(insertExamsQuery);
};

module.exports = seed;
