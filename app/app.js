const express = require("express");
const { getApi, getExams, getCandidates } = require("./app.controllers");
const { handle404Paths, handle500Error } = require("./error.controllers");

const app = express();

app.get("/", getApi);

app.get("/exams", getExams);

app.get("/candidates", getCandidates)

app.get("*", handle404Paths);

app.use(handle500Error);

module.exports = app;
