const express = require("express");
const cors = require("cors");
const {
  getApi,
  getExams,
  postExam,
  getCandidates,
  postCandidate,
} = require("./app.controllers");
const {
  handle404Paths,
  handle500Error,
  handleCustomError,
  handleSQLError,
} = require("./error.controllers");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", getApi);

app.get("/exams", getExams);
app.post("/exams", postExam);

app.get("/candidates", getCandidates);
app.post("/candidates", postCandidate);

app.get("*", handle404Paths);

app.use(handleCustomError);
app.use(handleSQLError);
app.use(handle500Error);

module.exports = app;
