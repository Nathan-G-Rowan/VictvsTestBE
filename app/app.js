const express = require("express");
const { getApi, getExams } = require("./app.controllers");
const { handle404Paths } = require("./error.controllers");

const app = express();

app.get("/api", getApi);
app.get("/api/exams", getExams);

app.get("*", handle404Paths);

module.exports = app;
