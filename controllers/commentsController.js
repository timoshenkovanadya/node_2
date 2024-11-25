const fs = require("fs");

const DATA_PATH = "../articles.json";

// path-> /news
function readall(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  fs.readFile(DATA_PATH, (error, buffer) => {
    const data = JSON.parse(buffer.toJSON());
  });

  news.forEach((item) => res.write(`[${item.date}]: ${item.text}</br>`));
  res.end();
}

// path-> /news/create
function addNews(req, res) {
  helper.parseBody(req, (err, body) => {
    const newItem = {
      id: news.length + 1,
      text: body.text,
      date: body.date,
    };

    news.push(newItem);
    res.statusCode = 201;
    res.end("Created");
  });
}

// path-> /news/text
function getFile(req, res) {
  fs.readFile("example.txt", "utf-8", (err, data) => {
    res.setHeader("Content-Type", "text/plain");
    res.end(data);
  });

  fs.writeFile("example.txt", "any text", {}, () =>
    console.log("file written")
  );
}

// path-> /news/text
function updateNews(req, res, params) {
  helper.parseBody(req, (err, body) => {
    news = news.map((item) =>
      item.id != params.id
        ? item
        : {
            id: item.id,
            text: body.text || item.text,
            date: body.date || item.date,
          }
    );

    res.end("Updated");
  });
}

module.exports = {
  hello,
  getNews,
  addNews,
  getFile,
  updateNews,
};
