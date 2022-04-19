const { HEADERS } = require('./corsHeader');

const handleSuccess = (res, data) => {
  res.writeHead(200, HEADERS);
  res.write(
    JSON.stringify({
      status: 'success',
      data: data,
    })
  );
  res.end();
};
module.exports = handleSuccess;
