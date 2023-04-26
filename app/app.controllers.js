const { selectExams, selectCandidates } = require("./app.models.js");

exports.getApi = (request, response, next) => {
  response.status(200).send();
};

exports.getExams = (request, response, next) => {
  const query = request.query;
  selectExams(query.date, query.candidate, query.location)
    .then((exams) => {
      response.status(200).send({ exams });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getCandidates = (request, response, next) => {
  selectCandidates().then((candidates) => {
    response.status(200).send({ candidates });
  });
};
