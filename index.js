const http = require("http");
const fs = require("fs");
const articlesControllers = require("./controllers/articles");
const helpers = require("./helpers");

fs.readFile("./articles.json", (error) => {
  if (error) return;
  const hostname = "127.0.0.1";
  const port = 3000;

  const endpointMapper = {
    "/api/articles/readall": articlesControllers.readall,
    "/api/articles/read": articlesControllers.read,
    // '/news': constrollers.getNews,
    // '/news/create': constrollers.addNews,
    // '/news/update': constrollers.updateNews,
    // '/news/text': constrollers.getFile
  };

  function send404(req, res) {
    res.statusCode = 404;
    res.end("404 Page Not Found");
  }

  const server = http.createServer((req, res) => {
    console.log(req.url);
    const { url } = helpers.parseUrl(req.url);
    console.log(url);
    const handler = endpointMapper[url.toString()];

    if (handler) {
      handler(req, res);
    } else {
      send404(req, res);
    }
  });

  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
});
