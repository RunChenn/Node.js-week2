const { HEADERS } = require('./corsHeader');

const handleError = (res, status, message) => {
  res.writeHead(status, HEADERS);
  res.write(
    JSON.stringify({
      status: 'false',
      message,
    })
  );
  res.end();
};
module.exports = handleError;
