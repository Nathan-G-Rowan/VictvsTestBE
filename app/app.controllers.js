const {
  selectExams,
  insertExam,
  selectCandidates,
  insertCandidate,
} = require("./app.models.js");

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

exports.postExam = (request, response, next) => {
  console.log(request.body);
  insertExam(request.body)
    .then((exam) => {
      response.status(201).send({ exam });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getCandidates = (request, response, next) => {
  selectCandidates()
    .then((candidates) => {
      response.status(200).send({ candidates });
    })
    .catch((error) => {
      next(error);
    });
};

exports.postCandidate = (request, response, next) => {
  insertCandidate(request.body.name)
    .then((candidate) => {
      response.status(201).send({ candidate });
    })
    .catch((error) => {
      next(error);
    });
};
