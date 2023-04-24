const express = require("express");
const { getApi } = require("./app.controllers");

const app = express();

app.get("/api", getApi);

module.exports = app;
