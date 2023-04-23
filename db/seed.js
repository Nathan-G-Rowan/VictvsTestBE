const db = require("./connection");
const format = require("pg-format");

const seed = async ({ candidateData }) => {
  await db.query(`DROP TABLE IF EXISTS candidates;`);

  const candidateQuery = `
    CREATE TABLE candidates (
      id SERIAL PRIMARY KEY,
      name VARCHAR
    );`;
  await db.query(candidateQuery);

  const insertCandidatesQuery = format(
    "INSERT INTO candidates (name) VALUES %L RETURNING *;",
    candidateData.map(({ Name }) => [Name])
  );

  return db.query(insertCandidatesQuery).then((result) => {
    return result.rows;
});
};

module.exports = seed;
