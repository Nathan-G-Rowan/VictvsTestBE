const db = require("../db/connection");

exports.selectExams = (date, candidate, location) => {
  let filterInsert = "";

  if (date) {
    if (/^\d{2}-\d{2}-\d{4}$/.test(date) || /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      filterInsert += `WHERE date >= '${date} 00:00:00.000' AND date <= '${date} 23:59:59.999 '`;
    } else return Promise.resolve([]);
  }

  if (candidate) {
    if (/^\d+$/.test(candidate)) {
      filterInsert += filterInsert ? "AND " : "WHERE ";
      filterInsert += `candidate_id = ${candidate} `;
    } else return Promise.resolve([]);
  }

  const argArr = [];

  if (location) {
    filterInsert += filterInsert ? "AND " : "WHERE ";
    filterInsert += `location_name = $1 `;
    argArr.push(location);
  }

  let selectExamsQuery = `
  SELECT  exams.*, candidates.name AS candidate_name FROM exams
  LEFT OUTER JOIN candidates
  ON exams.candidate_id = candidates.id
  ${filterInsert}ORDER BY date ASC;`;

  return db.query(selectExamsQuery, argArr).then((exams) => exams.rows);
};
