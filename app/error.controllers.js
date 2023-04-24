exports.handle404Paths = (request, response) => {
  response.status(404).send({ msg: "path not found" });
};
