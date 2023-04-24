const db = require("../db/connection");

exports.selectExams = () => {
  let selectExamsQuery = `
      SELECT * FROM exams ORDER BY date ASC
    ;`;
  return db.query(selectExamsQuery).then((exams) => exams.rows);
};
