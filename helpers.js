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

function logResponse(req, res, body) {
  const text = body
    ? `${res.statusCode} ${req.method} ${req.url} body: ${body}`
    : `${res.statusCode} ${req.method} ${req.url}`;
  const logEntry = `${new Date().toISOString()} - ${text}\n`;
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error("Failed to write to log file", err);
    }
  });
}

function send400(req, res, body) {
  res.statusCode = 400;
  logResponse(req, res, body);
  res.end(
    JSON.stringify({ code: res.statusCode, message: "Invalid parameters" })
  );
}

function send404(req, res, body) {
  res.statusCode = 404;
  logResponse(req, res, body);
  res.end(JSON.stringify({ code: res.statusCode, message: "Not found" }));
}

function send500(req, res, body) {
  res.statusCode = 500;
  logResponse(req, res, body);
  res.end(JSON.stringify({ code: res.statusCode, message: "Server error" }));
}

module.exports = {
  parseBody,
  parseUrl,
  logResponse,
  send400,
  send404,
  send500,
};
