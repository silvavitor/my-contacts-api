module.exports = (error, request, response) => {
  console.log(error);
  response.sendStatus(500);
};
