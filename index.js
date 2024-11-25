const http = require("http");
const fs = require("fs");
const articlesController = require("./controllers/articles");
const commentsController = require("./controllers/comments");
const helpers = require("./helpers");

fs.readFile("./articles.json", (error) => {
  if (error) return;
  const hostname = "127.0.0.1";
  const port = 3000;

  const endpointMapper = {
    "/api/articles/readall": articlesController.readall,
    "/api/articles/read": articlesController.read,
    "/api/articles/create": articlesController.create,
    "/api/articles/update": articlesController.update,
    "/api/articles/delete": articlesController.deleteArticle,
    "/api/comments/create": commentsController.create,
    "/api/comments/delete": commentsController.deleteComment,
  };

  const server = http.createServer((req, res) => {
    const { url } = helpers.parseUrl(req.url);
    const handler = endpointMapper[url.toString()];

    if (handler) {
      handler(req, res);
    } else {
      helpers.send404(req, res);
    }
  });

  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
});
