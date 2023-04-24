const { selectExams } = require("./app.models.js");

exports.getApi = (request, response) => {
  response.status(200).send();
};

exports.getExams = (request, response, next) => {
  selectExams().then((exams) => {
    response.status(200).send({ exams });
  });
};
