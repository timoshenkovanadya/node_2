const fs = require("fs");
const path = require("path");
const logFilePath = path.join(__dirname, "server.log");

function parseBody(req, cb) {
  let body = [];

  req
    .on("data", (chunk) => {
      body.push(chunk);
    })
    .on("end", () => {
      body = Buffer.concat(body).toString();
      body = JSON.parse(body);
      cb(null, body);
    });
}

function parseUrl(url) {
  const [parsedUrl, paramsString] = url.split("?");
  let parsedParams = null;

  if (paramsString) {
    const params = paramsString.split("&");
    parsedParams = params.reduce((acc, curr) => {
      const [key, value] = curr.split("=");
      acc[key] = value;

      return acc;
    }, {});
  }

  return {
    url: parsedUrl,
    params: parsedParams,
  };
}

function logResponse(response) {
  const logEntry = `${new Date().toISOString()} - ${response}\n`;
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error("Failed to write to log file", err);
    }
  });
}

function send400(_, res) {
  const errorMessage = "400 Invalid parameters";
  res.statusCode = 400;
  logResponse(errorMessage);
  res.end(errorMessage);
}
function send404(_, res) {
  const errorMessage = "404 Page Not Found";
  res.statusCode = 404;
  logResponse(errorMessage);
  res.end(errorMessage);
}

function send500(_, res) {
  const errorMessage = "500 Server Error";
  res.statusCode = 500;
  logResponse(errorMessage);
  res.end(errorMessage);
}

module.exports = {
  parseBody,
  parseUrl,
  logResponse,
  send400,
  send404,
  send500,
};
