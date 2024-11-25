const fs = require("fs");
const helpers = require("../helpers");

const DATA_PATH = "articles.json";

function readall(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  fs.readFile(DATA_PATH, (error, buffer) => {
    if (error) {
      helpers.send500();
      return;
    }
    const data = JSON.parse(buffer);
    const articlesWithComments = data.articles?.map(({ comments, ...rest }) => {
      const fullComments = comments.map((commentId) =>
        data.comments.find((comment) => comment.id === commentId)
      );
      return { ...rest, comments: fullComments };
    });
    res.write(JSON.stringify(articlesWithComments));
    res.end();
  });
}

function read(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  let body = "";
  req.on("data", (data) => {
    body += data;
  });
  req.on("end", () => {
    const id = JSON.parse(body)?.id;
    if (!id || typeof id !== "number" || typeof id !== "string")
      helpers.send400();

    fs.readFile(DATA_PATH, (error, buffer) => {
      if (error) {
        helpers.send500();
        return;
      }
      const data = JSON.parse(buffer);
      const article = data.articles.find((item) => item.id === id.toString());
      if (!article) helpers.send400();
      res.write(JSON.stringify(article));
      res.end();
    });
  });
}

function create(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  let body = "";
  req.on("data", (data) => {
    body += data;
  });
  req.on("end", () => {
    const newArticle = JSON.parse(body);
    if (
      !newArticle ||
      typeof newArticle.title !== "string" ||
      typeof newArticle.text !== "string" ||
      typeof newArticle.date !== "number" ||
      typeof newArticle.author !== "string" ||
      isNaN(new Date(newArticle.date))
    ) {
      helpers.send400();
      return;
    }

    fs.readFile(DATA_PATH, (error, buffer) => {
      if (error) {
        helpers.send500();
        return;
      }
      const data = JSON.parse(buffer);
      const id = (Number(data.articles?.at(-1)?.id) + 1).toString();
      newArticle.comments = [];
      newArticle.id = id;
      data.articles.push(newArticle);
      fs.writeFile(DATA_PATH, JSON.stringify(data), (err) => {
        if (err) throw err;
      });
      res.write(JSON.stringify(newArticle));
      res.end();
    });
  });
}

function update(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  let body = "";
  req.on("data", (data) => {
    body += data;
  });
  req.on("end", () => {
    const dataObj = JSON.parse(body);
    if (
      !dataObj ||
      (typeof dataObj.id !== "number" && typeof dataObj.id !== "string")
    ) {
      helpers.send400();
      return;
    }

    fs.readFile(DATA_PATH, (error, buffer) => {
      if (error) {
        helpers.send500();
        return;
      }

      const data = JSON.parse(buffer);
      const index = data.articles.findIndex(
        (item) => item.id === dataObj.id.toString()
      );
      const oldArticle = data.articles[index];

      if (
        !oldArticle ||
        (dataObj.title && typeof dataObj.title !== "string") ||
        (dataObj.text && typeof dataObj.text !== "string") ||
        (dataObj.author && typeof dataObj.author !== "string") ||
        (dataObj.date &&
          typeof dataObj.date !== "number" &&
          isNaN(new Date(dataObj.date))) ||
        Object.keys(dataObj).some((key) => !oldArticle[key])
      ) {
        helpers.send400();
        return;
      }
      const newArticle = { ...oldArticle, ...dataObj };
      data.articles[index] = newArticle;

      fs.writeFile(DATA_PATH, JSON.stringify(data), (err) => {
        if (err) throw err;
      });
      res.write(JSON.stringify(newArticle));
      res.end();
    });
  });
}

function deleteArticle(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  let body = "";
  req.on("data", (data) => {
    body += data;
  });
  req.on("end", () => {
    const dataObj = JSON.parse(body);
    if (
      !dataObj ||
      (typeof dataObj.id !== "number" && typeof dataObj.id !== "string")
    ) {
      helpers.send400();
      return;
    }

    fs.readFile(DATA_PATH, (error, buffer) => {
      if (error) {
        helpers.send500();
        return;
      }

      const data = JSON.parse(buffer);
      const index = data.articles.findIndex(
        (item) => item.id === dataObj.id.toString()
      );
      const oldArticle = data.articles[index];

      if (!oldArticle) {
        helpers.send400();
        return;
      }
      if (oldArticle.comments) {
        data.comments = data.comments.filter(
          ({ id }) => !oldArticle.comments.includes(id)
        );
      }
      data.articles.splice(index, 1);
      fs.writeFile(DATA_PATH, JSON.stringify(data), (err) => {
        if (err) throw err;
      });
      res.write(JSON.stringify(`Article id=${dataObj.id} deleted`));
      res.end();
    });
  });
}

module.exports = {
  readall,
  read,
  create,
  update,
  deleteArticle,
};
